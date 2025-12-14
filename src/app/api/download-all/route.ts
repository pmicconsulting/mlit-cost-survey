import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { readFile } from "fs/promises";
import { join } from "path";

const ALLOWED_FILES = [
  "survey_sample.xlsx",
  "cost_calculation.xlsx",
  "survey_template.xlsx",
  "survey_guide.xlsx",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { files } = body as { files: string[] };

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "ファイルが選択されていません" },
        { status: 400 }
      );
    }

    // セキュリティチェック: 許可されたファイルのみ
    const validFiles = files.filter((file) => ALLOWED_FILES.includes(file));

    if (validFiles.length === 0) {
      return NextResponse.json(
        { error: "有効なファイルが選択されていません" },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    for (const filename of validFiles) {
      try {
        const filePath = join(process.cwd(), "public", "downloads", filename);
        const fileContent = await readFile(filePath);
        zip.file(filename, fileContent);
      } catch (error) {
        console.error(`ファイル読み込みエラー: ${filename}`, error);
        // ファイルが存在しない場合はスキップ
      }
    }

    const zipContent = await zip.generateAsync({ type: "blob" });

    return new Response(zipContent, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=mlit_survey_files.zip",
      },
    });
  } catch (error) {
    console.error("ZIP作成エラー:", error);
    return NextResponse.json(
      { error: "ファイルの圧縮に失敗しました" },
      { status: 500 }
    );
  }
}
