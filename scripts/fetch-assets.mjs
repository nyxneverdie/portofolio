import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
const base = 'https://www.duingzforge.site/kit/portfolio/';
const files = [
  "Asset/cv/Renando_Editor_VFX.pdf.pdf",
  "Asset/img/SERTIFIKAT/dalang.jpg",
  "Asset/img/SERTIFIKAT/juara2.jpg",
  "Asset/img/SERTIFIKAT/mindplace2.jpg",
  "Asset/img/SERTIFIKAT/peringkat2.jpg",
  "Asset/img/SERTIFIKAT/shortmovie.jpeg",
  "Asset/img/SERTIFIKAT/videolabs.jpg",
  "Asset/img/favicon.svg",
  "Asset/img/gwe.jpeg",
  "Asset/img/renando-portrait.png",
  "Asset/svg/CUI.svg",
  "Asset/svg/EBS.svg",
  "Asset/svg/EG.svg",
  "Asset/svg/PF.svg",
  "Asset/svg/SB.svg",
  "Asset/svg/SD.svg",
  "Asset/svg/UE.svg",
  "Asset/svg/ae.svg",
  "Asset/svg/ai.svg",
  "Asset/svg/am.svg",
  "Asset/svg/bl.svg",
  "Asset/svg/brand/Extrajoss.png",
  "Asset/svg/brand/Netflix.svg",
  "Asset/svg/brand/SevenDragon.png",
  "Asset/svg/brand/Whatsin.png",
  "Asset/svg/brand/diskominfo.png",
  "Asset/svg/brand/dpmptsp.png",
  "Asset/svg/brand/hara.png",
  "Asset/svg/brand/jeta.png",
  "Asset/svg/brand/logogatsu.png",
  "Asset/svg/brand/magma.png",
  "Asset/svg/brand/mbc.png",
  "Asset/svg/brand/pemda.png",
  "Asset/svg/brand/raincreation.png",
  "Asset/svg/brand/seven.png",
  "Asset/svg/brand/sma1seragen.png",
  "Asset/svg/brand/sma2indramayu.png",
  "Asset/svg/brand/unwir.png",
  "Asset/svg/brand/vianos.png",
  "Asset/svg/cc.svg",
  "Asset/svg/cv.svg",
  "Asset/svg/cx.svg",
  "Asset/svg/ibis.svg",
  "Asset/svg/is.svg",
  "Asset/svg/km.svg",
  "Asset/svg/lr.svg",
  "Asset/svg/lrc.svg",
  "Asset/svg/pa.svg",
  "Asset/svg/pl.svg",
  "Asset/svg/pr.svg",
  "Asset/svg/ps.svg",
  "Asset/svg/vn.svg",
  "Asset/svg/vs.svg",
  "Asset/svg/vsco.svg"
];
let failed = 0;
for (const path of files) {
  try {
    const response = await fetch(base + path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!bytes.length) throw new Error('empty response');
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, bytes);
    console.log(`Downloaded ${path}`);
  } catch (error) {
    failed++;
    console.error(`Failed ${path}: ${error.message}`);
  }
}
if (failed) { console.error(`${failed} asset(s) could not be fetched.`); process.exitCode = 1; }
