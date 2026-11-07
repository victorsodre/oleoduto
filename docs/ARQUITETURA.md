# Arquitetura implementada

React 19.2.6, TypeScript 5.9.3, Three.js 0.187.0 e Vite 8.3.6. Site estático independente, com caminhos relativos e lockfile fixado.

- `src/simulation/flow.ts`: intervalos dos lotes, histórico de destinos e integração por trechos. Uma matriz 3×3 soma o que cada tanque recebeu de cada origem; nenhuma troca apaga recebimentos anteriores. Grandezas em unidades ilustrativas.
- `src/scene/pipeline.ts`: nove grupos semânticos, geometria autoral, texturas de padrões geradas localmente, válvulas e níveis determinados pelo mesmo balanço da UI.
- `src/scene/runtime.ts`: órbita, seleção, enquadramento, corte, isolamento, desmontagem, malha e ciclo de vida WebGL.
- `src/App.tsx`: controles HTML, histórico, balanço legível e tour; móvel usa diálogo para catálogo e detalhe abaixo do modelo.
- `src/scene/capture.ts`: PNG 1920×1080 ou 1080×1920. Vertical usa câmera específica e legenda; restaura câmera/resolução ao terminar.
- `src/content/project.ts`: explicações, limites e fontes.

Base visual e infraestrutura derivadas do projeto autoral `caminhao-lixo`. Cada repositório instala e compila sozinho; não há dependência de diretórios vizinhos. O mecanismo e a cena são próprios do oleoduto. Nenhum código/asset do Fusquinha foi copiado.

Renderização sob demanda, 30 fps durante interação, DPR até 1,5, suspensão por visibilidade, descarte de recursos. Vista inicial: 156 draw calls, aproximadamente 35.066 triângulos incluindo sombras. JS de produção 805,26 KB / 216,43 KB gzip; aviso de chunk acima de 500 KB mantido visível.

Sem backend, dados pessoais, tráfego de telemetria, física CFD, som ou uso da GPU de produção. As cores/padrões e dimensões não são dados de um terminal real.
