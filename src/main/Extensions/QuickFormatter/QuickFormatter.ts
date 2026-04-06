import { XmlBuilder } from "@Core/XmlBuilder/XmlBuilder";
import { XmlParser } from "@Core/XmlParser/XmlParser";

export class QuickFormatter {
    private static readonly xmlParser = new XmlParser();
    private static readonly xmlParserOptions = {
        ignoreAttributes: false,
        processEntities: true,
        preserveOrder: false,
    };

    private static readonly xmlBuilder = new XmlBuilder();
    private static readonly xmlBuilderOptions = {
        format: true,
        indentBy: "  ",
        ignoreAttributes: false,
        processEntities: true,
    };

    public static formatAuto(text: string, enableDeepFormatting: boolean): string {
        const result = this.formatAutoInternal(text, enableDeepFormatting);

        if (enableDeepFormatting) {
            return result.replace(/\\n/g, "\n");
        }

        return result;
    }

    private static formatAutoInternal(text: string, enableDeepFormatting: boolean): string {
        try {
            const trimmed = text.trim();

            if (!trimmed) {
                return text;
            }

            if (trimmed.startsWith("<")) {
                try {
                    this.xmlParser.parse(trimmed, this.xmlParserOptions);
                    return this.formatXmlInternal(trimmed, enableDeepFormatting, true);
                } catch {
                    return this.formatStackTraceInternal(trimmed, enableDeepFormatting, true);
                }
            } else if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                try {
                    JSON.parse(trimmed);
                    return this.formatJsonInternal(trimmed, enableDeepFormatting, true);
                } catch {
                    return this.formatStackTraceInternal(trimmed, enableDeepFormatting, true);
                }
            } else {
                return this.formatStackTraceInternal(trimmed, enableDeepFormatting, true);
            }
        } catch {
            return text;
        }
    }

    public static formatJson(text: string, enableDeepFormatting: boolean): string {
        return this.formatJsonInternal(text, enableDeepFormatting, false);
    }

    private static formatJsonInternal(text: string, enableDeepFormatting: boolean, allowAutoDetect: boolean): string {
        try {
            let json = JSON.parse(text);

            if (enableDeepFormatting) {
                json = allowAutoDetect ? this.formatDeepJsonAuto(json) : this.formatDeepJson(json);
            }

            return JSON.stringify(json, null, 2);
        } catch {
            return text;
        }
    }

    private static formatDeepJsonAuto(value: unknown): unknown {
        if (typeof value === "string") {
            const formatted = this.formatAutoInternal(value, true);

            if (formatted.trim().startsWith("{") || formatted.trim().startsWith("[")) {
                try {
                    const parsed = JSON.parse(formatted);
                    return this.formatDeepJsonAuto(parsed);
                } catch {
                    return formatted;
                }
            }

            return formatted;
        }

        if (Array.isArray(value)) {
            return value.map((item) => this.formatDeepJsonAuto(item));
        }

        if (typeof value === "object" && value !== null) {
            const result: Record<string, unknown> = {};

            for (const key of Object.keys(value)) {
                result[key] = this.formatDeepJsonAuto((value as Record<string, unknown>)[key]);
            }

            return result;
        }

        return value;
    }

    private static formatDeepJson(text: unknown): unknown {
        if (typeof text === "string") {
            try {
                const json = JSON.parse(text);

                if (typeof json === "object" && json !== null) {
                    return this.formatDeepJson(json);
                }
            } catch {
                // no valid JSON, keep string value
            }

            return text;
        }

        if (Array.isArray(text)) {
            return text.map((item) => this.formatDeepJson(item));
        }

        if (typeof text === "object" && text !== null) {
            return Object.fromEntries(Object.entries(text).map(([k, v]) => [k, this.formatDeepJson(v)]));
        }

        return text;
    }

    public static formatStackTrace(text: string, enableDeepFormatting: boolean): string {
        return this.formatStackTraceInternal(text, enableDeepFormatting, false);
    }

    private static formatStackTraceInternal(
        text: string,
        enableDeepFormatting: boolean,
        allowAutoDetect: boolean,
    ): string {
        try {
            const normalized = text
                .replace(/\\t/g, "  ")
                .replace(/\\r\\n/g, "\n")
                .replace(/\\r/g, "\n")
                .replace(/\\n/g, "\n")
                .replace(/\r\n/g, "\n")
                .replace(/\r/g, "\n")
                .replace(/\t/g, "  ");

            const lines = normalized.split("\n");
            const result: string[] = [];
            let lastWasEmpty = false;

            for (const line of lines) {
                const trimmed = line.trim();

                if (trimmed.length === 0) {
                    if (!lastWasEmpty) {
                        result.push("");
                        lastWasEmpty = true;
                    }

                    continue;
                }

                lastWasEmpty = false;

                if (allowAutoDetect && enableDeepFormatting) {
                    if (
                        ((trimmed.startsWith("{") || trimmed.startsWith("[")) && trimmed.endsWith("}")) ||
                        trimmed.endsWith("]")
                    ) {
                        try {
                            JSON.parse(trimmed);
                            const formatted = this.formatAutoInternal(trimmed, true);
                            result.push(formatted);
                            continue;
                        } catch {
                            // Not valid JSON, fall through
                        }
                    }

                    if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
                        try {
                            this.xmlParser.parse(trimmed, this.xmlParserOptions);
                            const formatted = this.formatAutoInternal(trimmed, true);
                            result.push(formatted);
                            continue;
                        } catch {
                            // Not valid XML, fall through
                        }
                    }

                    const atMatch = trimmed.match(/^(at\s+|File\s+)(.+)$/i);

                    if (atMatch) {
                        const prefix = atMatch[1];
                        const content = atMatch[2];

                        if (
                            ((content.startsWith("{") || content.startsWith("[")) && content.endsWith("}")) ||
                            content.endsWith("]")
                        ) {
                            try {
                                JSON.parse(content);
                                const formatted = this.formatAutoInternal(content, true);
                                result.push("  " + prefix.trimEnd() + " " + formatted);
                                continue;
                            } catch {
                                // Not valid JSON, fall through
                            }
                        }

                        if (content.startsWith("<") && content.endsWith(">")) {
                            try {
                                this.xmlParser.parse(content, this.xmlParserOptions);
                                const formatted = this.formatAutoInternal(content, true);
                                result.push("  " + prefix.trimEnd() + " " + formatted);
                                continue;
                            } catch {
                                // Not valid XML, fall through
                            }
                        }
                    }
                }

                if (trimmed.match(/^(at\s+|File\s+)/i)) {
                    result.push("  " + trimmed);
                } else {
                    result.push(trimmed);
                }
            }

            return result.join("\n");
        } catch {
            return text;
        }
    }

    public static formatXml(text: string, enableDeepFormatting: boolean): string {
        return this.formatXmlInternal(text, enableDeepFormatting, false);
    }

    private static formatXmlInternal(text: string, enableDeepFormatting: boolean, allowAutoDetect: boolean): string {
        try {
            let wasUnescaped = false;

            if ((text.includes("&lt;") || text.includes("&gt;") || text.includes("&amp;")) && enableDeepFormatting) {
                text = this.unescapeXml(text);
                wasUnescaped = true;
            }

            let xml = this.xmlParser.parse(text, this.xmlParserOptions);

            if (enableDeepFormatting && !wasUnescaped) {
                xml = allowAutoDetect ? this.formatDeepXmlAuto(xml) : this.formatDeepXml(xml);
            }

            let result = this.xmlBuilder.build(xml, this.xmlBuilderOptions).trimEnd();

            if (enableDeepFormatting && allowAutoDetect) {
                result = result.replace(/&quot;/g, '"').replace(/&apos;/g, "'");
            }

            return result;
        } catch {
            return text;
        }
    }

    private static formatDeepXml(xmlNode: unknown): unknown {
        if (typeof xmlNode === "string") {
            if (!xmlNode.trim().startsWith("<")) {
                return xmlNode;
            }

            const unescaped = this.unescapeXml(xmlNode);

            try {
                return this.formatDeepXml(this.xmlParser.parse(unescaped, this.xmlParserOptions));
            } catch {
                return xmlNode;
            }
        }

        if (Array.isArray(xmlNode)) {
            return xmlNode.map((node) => this.formatDeepXml(node));
        }

        if (typeof xmlNode === "object" && xmlNode !== null) {
            const result: Record<string, unknown> = {};

            for (const key of Object.keys(xmlNode)) {
                result[key] = this.formatDeepXml((xmlNode as Record<string, unknown>)[key]);
            }

            return result;
        }

        return xmlNode;
    }

    private static formatDeepXmlAuto(xmlNode: unknown): unknown {
        if (typeof xmlNode === "string") {
            if (!xmlNode.trim().startsWith("<")) {
                return this.formatAutoInternal(xmlNode, true);
            }

            const unescaped = this.unescapeXml(xmlNode);

            try {
                return this.formatDeepXmlAuto(this.xmlParser.parse(unescaped, this.xmlParserOptions));
            } catch {
                return this.formatAutoInternal(xmlNode, true);
            }
        }

        if (Array.isArray(xmlNode)) {
            return xmlNode.map((node) => this.formatDeepXmlAuto(node));
        }

        if (typeof xmlNode === "object" && xmlNode !== null) {
            const result: Record<string, unknown> = {};

            for (const key of Object.keys(xmlNode)) {
                result[key] = this.formatDeepXmlAuto((xmlNode as Record<string, unknown>)[key]);
            }

            return result;
        }

        return xmlNode;
    }

    private static unescapeXml(text: string): string {
        return text
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
            .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    }
}
