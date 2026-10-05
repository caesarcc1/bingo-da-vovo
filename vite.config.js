import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'
import * as lightning from 'lightningcss'

// Desempacota @layer do Tailwind v4 para que navegadores anteriores ao Chrome 99 (como Chrome 81) reconheçam todas as regras e variáveis
function unwrapAllLayers(cssCode) {
  let out = '';
  let i = 0;
  while (i < cssCode.length) {
    if (cssCode.startsWith('@layer', i)) {
      const semi = cssCode.indexOf(';', i);
      const brace = cssCode.indexOf('{', i);
      if (semi !== -1 && (brace === -1 || semi < brace)) {
        i = semi + 1;
        continue;
      } else if (brace !== -1) {
        i = brace + 1;
        let depth = 1;
        let contentStart = i;
        while (i < cssCode.length && depth > 0) {
          if (cssCode[i] === '{') depth++;
          else if (cssCode[i] === '}') depth--;
          i++;
        }
        out += cssCode.substring(contentStart, i - 1);
        continue;
      }
    }
    out += cssCode[i];
    i++;
  }
  return out;
}

function legacyCssCompatPlugin() {
  return {
    name: 'legacy-css-compat',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (fileName.endsWith('.css') && chunk.type === 'asset') {
          const originalSource = typeof chunk.source === 'string'
            ? chunk.source
            : chunk.source.toString('utf8');

          const unwrapped = unwrapAllLayers(originalSource);
          try {
            const transformed = lightning.transform({
              filename: fileName,
              code: Buffer.from(unwrapped),
              minify: true,
              targets: {
                chrome: 80 << 16
              }
            });
            chunk.source = transformed.code.toString();
          } catch (err) {
            console.warn('[legacy-css-compat] Erro ao transformar CSS com LightningCSS:', err.message);
            chunk.source = unwrapped;
          }
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ['chrome >= 80', 'android >= 4.4'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true
    }),
    legacyCssCompatPlugin()
  ],
  esbuild: {
    target: 'chrome80',
    supported: {
      'logical-assignment-operators': false
    }
  },
  build: {
    target: ['es2018', 'chrome80'],
    cssMinify: 'lightningcss'
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: {
        chrome: 80 << 16
      }
    }
  }
})
