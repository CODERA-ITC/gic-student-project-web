<template>
  <div class="doc-markdown" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string;
}>();

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatInline = (value: string) => {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return output;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[`*_]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const renderMarkdown = (markdown: string) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let inUl = false;
  let inOl = false;
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    const text = paragraphBuffer.join(" ").trim();
    if (text) {
      html.push(`<p>${formatInline(text)}</p>`);
    }
    paragraphBuffer = [];
  };

  const closeLists = () => {
    if (inUl) {
      html.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      html.push("</ol>");
      inOl = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine ?? "";

    if (line.trim().startsWith("```")) {
      flushParagraph();
      closeLists();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBuffer = [];
      } else {
        html.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
        inCodeBlock = false;
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeLists();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeLists();
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].trim();
      const id = slugify(headingText);
      html.push(
        `<h${level} id="${id}" class="scroll-mt-24">${formatInline(headingText)}</h${level}>`,
      );
      continue;
    }

    const ulMatch = line.match(/^(\s*)-\s+(.*)$/);
    if (ulMatch) {
      flushParagraph();
      if (inOl) {
        html.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        html.push("<ul>");
        inUl = true;
      }
      const indentSpaces = ulMatch[1]?.length || 0;
      const indentLevel = Math.floor(indentSpaces / 2);
      const marginLeft = indentLevel * 1.0;
      html.push(
        `<li style="margin-left:${marginLeft}rem">${formatInline(ulMatch[2].trim())}</li>`,
      );
      continue;
    }

    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (olMatch) {
      flushParagraph();
      if (inUl) {
        html.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        html.push("<ol>");
        inOl = true;
      }
      html.push(`<li>${formatInline(olMatch[1].trim())}</li>`);
      continue;
    }

    if (line.trim() === "---") {
      flushParagraph();
      closeLists();
      html.push("<hr />");
      continue;
    }

    paragraphBuffer.push(line.trim());
  }

  if (inCodeBlock) {
    html.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
  }

  flushParagraph();
  closeLists();

  return html.join("\n");
};

const renderedHtml = computed(() => renderMarkdown(props.content || ""));
</script>

<style scoped>
.doc-markdown {
  color: inherit;
}

.doc-markdown :deep(h1) {
  font-size: 1.75rem;
  line-height: 2.1rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: rgb(15 23 42);
}

.dark .doc-markdown :deep(h1) {
  color: rgb(248 250 252);
}

.doc-markdown :deep(h2) {
  font-size: 1.25rem;
  line-height: 1.8rem;
  font-weight: 700;
  margin: 1.5rem 0 0.75rem;
  color: rgb(15 23 42);
}

.dark .doc-markdown :deep(h2) {
  color: rgb(248 250 252);
}

.doc-markdown :deep(h3) {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: rgb(30 41 59);
}

.dark .doc-markdown :deep(h3) {
  color: rgb(226 232 240);
}

.doc-markdown :deep(p) {
  margin: 0.5rem 0;
  color: rgb(71 85 105);
  line-height: 1.7;
}

.dark .doc-markdown :deep(p) {
  color: rgb(203 213 225);
}

.doc-markdown :deep(ul),
.doc-markdown :deep(ol) {
  margin: 0.5rem 0 0.75rem;
  padding-left: 1.25rem;
  color: rgb(71 85 105);
}

.doc-markdown :deep(ul) {
  list-style: disc;
}

.doc-markdown :deep(ol) {
  list-style: decimal;
}

.dark .doc-markdown :deep(ul),
.dark .doc-markdown :deep(ol) {
  color: rgb(203 213 225);
}

.doc-markdown :deep(li) {
  margin: 0.25rem 0;
  line-height: 1.6;
}

.doc-markdown :deep(code) {
  background: rgb(241 245 249);
  color: rgb(15 23 42);
  border-radius: 0.375rem;
  padding: 0.1rem 0.35rem;
  font-size: 0.875em;
}

.dark .doc-markdown :deep(code) {
  background: rgb(30 41 59);
  color: rgb(226 232 240);
}

.doc-markdown :deep(pre) {
  background: rgb(15 23 42);
  color: rgb(226 232 240);
  border-radius: 0.75rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 0.75rem 0 1rem;
}

.doc-markdown :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.doc-markdown :deep(hr) {
  border: 0;
  border-top: 1px solid rgb(226 232 240);
  margin: 1rem 0;
}

.dark .doc-markdown :deep(hr) {
  border-top-color: rgb(51 65 85);
}
</style>
