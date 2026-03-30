import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            maxWidth: 560,
            margin: '0 auto',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: 20, marginBottom: 12 }}>
            Erro ao carregar a aplicação
          </h1>
          <pre
            style={{
              background: '#f4f4f5',
              padding: 12,
              overflow: 'auto',
              fontSize: 13,
              borderRadius: 8,
            }}
          >
            {this.state.error.message}
          </pre>
          <p style={{ color: '#52525b', fontSize: 14, marginTop: 16 }}>
            Abra o Console (F12 → Console) para mais detalhes. Em desenvolvimento o
            Vite também pode mostrar um overlay vermelho com o stack.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
