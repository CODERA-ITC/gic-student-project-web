import fs from "fs";

let content = fs.readFileSync("app/constants/projects.ts", "utf8");

// Change id to string
content = content.replace(/id: (\d+),/g, 'id: "$1",');

// Add departmentId after academicYear
content = content.replace(
  /academicYear: "([^"]*)",/g,
  'academicYear: "$1",\n    departmentId: "11111111-1111-1111-1111-111111111111",',
);

// Add id to authors
let lines = content.split("\n");
let projectId = "";
for (let i = 0; i < lines.length; i++) {
  const idMatch = lines[i].match(/id: "(\d+)"/);
  if (idMatch) projectId = idMatch[1];
  if (lines[i].includes("author: {") && !lines[i + 1].includes("id:")) {
    lines.splice(i + 1, 0, `      id: "author-${projectId}",`);
  }
}

// Convert images
content = lines.join("\n");
content = content.replace(
  /images: \[\s*((?:"[^"]*"(?:,\s*)?)+)\s*\]/g,
  (match, urlsStr) => {
    const urls = urlsStr.split(",").map((u) => u.trim().slice(1, -1));
    const before = content.substring(0, content.indexOf(match));
    const idMatch = before.match(/id: "(\d+)"/g);
    const projectId = idMatch
      ? idMatch[idMatch.length - 1].match(/"(\d+)"/)[1]
      : "unknown";
    const objects = urls.map(
      (url, i) => `      {
        id: "img-${projectId}-${i + 1}",
        originalUrl: "${url}",
        thumbnailUrl: "${url}",
      }`,
    );
    return `images: [
${objects.join(",\n")}
    ]`;
  },
);

fs.writeFileSync("app/constants/projects.ts", content);
