import { useThemeColor } from "@/hooks/useThemeColor";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";

export default function ThemedRenderHTML({ html }: { html: string }) {
    const textColor = useThemeColor({}, 'text');
    const primaryColor = useThemeColor({}, 'primary');
    const { width } = useWindowDimensions();

    const source = useMemo(() => ({ html }), [html]);

    const baseStyle = useMemo(() => ({
        fontSize: 16,
        color: textColor,
        lineHeight: 24,
    }), [textColor]);

    const tagsStyles = useMemo(() => ({
        p: {
            marginBottom: 10,
        },
        img: {
            width: '100%',
            height: 'auto',
            padding: 0,
            marginBottom: 10,
            backgroundColor: 'white',
        },
        a: {
            color: primaryColor,
            textDecorationLine: 'underline',
        },
        button: {
            backgroundColor: primaryColor,
            padding: 10,
            borderRadius: 5,
        },
        h1: {
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 16,
            color: textColor,
        },
        h2: {
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 14,
            color: textColor,
        },
        h3: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 12,
            color: textColor,
        },
        h4: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            color: textColor,
        },
        h5: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 8,
            color: textColor,
        },
        h6: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 6,
            color: textColor,
        },
        ul: {
            marginBottom: 10,
            paddingLeft: 20,
        },
        ol: {
            marginBottom: 10,
            paddingLeft: 20,
        },
        li: {
            marginBottom: 5,
        },
        blockquote: {
            borderLeftWidth: 4,
            borderLeftColor: primaryColor,
            paddingLeft: 10,
            marginLeft: 0,
            marginBottom: 10,
            fontStyle: 'italic',
        },
        code: {
            backgroundColor: '#f5f5f5',
            padding: 2,
            borderRadius: 3,
            fontFamily: 'monospace',
        },
        pre: {
            backgroundColor: '#f5f5f5',
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
        },
        hr: {
            borderBottomWidth: 1,
            borderBottomColor: textColor,
            marginVertical: 10,
        },
        table: {
            borderWidth: 1,
            borderColor: textColor,
            marginBottom: 10,
        },
        th: {
            borderWidth: 1,
            borderColor: textColor,
            padding: 8,
            fontWeight: 'bold',
        },
        td: {
            borderWidth: 1,
            borderColor: textColor,
            padding: 8,
        }
    }), [textColor, primaryColor]);

    return (
        <RenderHtml
            contentWidth={width}
            source={source}
            baseStyle={baseStyle}
            tagsStyles={tagsStyles}
        />
    )
}