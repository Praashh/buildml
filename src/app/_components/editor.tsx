"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import React from "react";

interface CodeEditorProps {
	value?: string;
	onChange?: (value: string | undefined) => void;
	language?: string;
}

export default function CodeEditor({
	value,
	onChange,
	language = "python",
}: CodeEditorProps) {
	const { theme } = useTheme();
	return (
		<Editor
			height="100%"
			language={language}
			onChange={onChange}
			options={{
				minimap: { enabled: false },
				fontSize: 14,
				lineNumbers: "on",
				scrollBeyondLastLine: false,
				automaticLayout: true,
			}}
			theme={theme === "dark" ? "vs-dark" : "light"}
			value={value}
		/>
	);
}
