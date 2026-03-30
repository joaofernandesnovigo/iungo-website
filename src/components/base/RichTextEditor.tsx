import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $createParagraphNode, $createTextNode, EditorState } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string, text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Plugin para capturar mudanças
function OnChangePluginWrapper({ onChange }: { onChange: (html: string, text: string) => void }) {
  const [editor] = useLexicalComposerContext();

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      const text = $getRoot().getTextContent();
      onChange(html, text);
    });
  };

  return <OnChangePlugin onChange={handleChange} />;
}

// Plugin para toolbar
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatBold = () => {
    editor.dispatchCommand({ type: 'FORMAT_TEXT_COMMAND', payload: 'bold' } as any, undefined);
  };

  const formatItalic = () => {
    editor.dispatchCommand({ type: 'FORMAT_TEXT_COMMAND', payload: 'italic' } as any, undefined);
  };

  const formatUnderline = () => {
    editor.dispatchCommand({ type: 'FORMAT_TEXT_COMMAND', payload: 'underline' } as any, undefined);
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={formatBold}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Negrito (Ctrl+B)"
      >
        <i className="ri-bold text-gray-700"></i>
      </button>
      <button
        type="button"
        onClick={formatItalic}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Itálico (Ctrl+I)"
      >
        <i className="ri-italic text-gray-700"></i>
      </button>
      <button
        type="button"
        onClick={formatUnderline}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Sublinhado (Ctrl+U)"
      >
        <i className="ri-underline text-gray-700"></i>
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <button
        type="button"
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Lista com marcadores"
      >
        <i className="ri-list-unordered text-gray-700"></i>
      </button>
      <button
        type="button"
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Lista numerada"
      >
        <i className="ri-list-ordered text-gray-700"></i>
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <button
        type="button"
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Link"
      >
        <i className="ri-link text-gray-700"></i>
      </button>
    </div>
  );
}

export default function RichTextEditor({ value, onChange, placeholder = 'Digite sua mensagem...', disabled = false }: RichTextEditorProps) {
  const initialConfig = {
    namespace: 'EmailEditor',
    theme: {
      paragraph: 'mb-2',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
      },
    },
    onError: (error: Error) => {
      console.error('Lexical Error:', error);
    },
    editable: !disabled,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="min-h-[120px] max-h-[300px] overflow-y-auto px-4 py-3 focus:outline-none"
                style={{ caretColor: '#14B8A6' }}
              />
            }
            placeholder={
              <div className="absolute top-3 left-4 text-gray-400 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <OnChangePluginWrapper onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}
