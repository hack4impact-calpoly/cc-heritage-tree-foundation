// import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/database/db";
import Tree from "../../../../database/treeSchema";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { S3 } from "aws-sdk";

const s3 = new S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

type IParams = {
  params: {
    treeId: string;
  };
};

export async function PUT(req: NextRequest, { params }: { params: Promise<{ treeID: string }> }) {
  await connectDB();

  try {
    const { treeID } = await params;
    const formData = await req.formData();

    // Handle multiple file uploads
    const files = formData.getAll("files") as File[];
    const imageUrls: string[] = [];

    // Upload all new files to S3
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = file.name;

        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `${Date.now()}_${filename}`,
          Body: buffer,
          ContentType: file.type,
        };

        const result = await s3.upload(params).promise();
        imageUrls.push(result.Location);
      }
    }

    // Get existing photos from form data
    const existingPhotos = formData.getAll("existingPhotos") as string[];
    const allPhotos = [...existingPhotos, ...imageUrls];

    // Collect the rest of the fields
    const treeData = {
      collectorName: formData.get("collectorName"),
      dateCollected: new Date(formData.get("dateCollected") as string),
      species: formData.get("species"),
      dbh: formData.get("dbh"),
      canopyBreadth: formData.get("canopyBreadth"),
      treeHeight: Number(formData.get("treeHeight")),
      treeQuality: Number(formData.get("treeQuality")),
      additionalNotes: formData.get("additionalNotes"),
      gpsCoordinates: [formData.get("gpsCoordinates[0]"), formData.get("gpsCoordinates[1]")],
      treeCondition: Array.from(formData.entries())
        .filter(([key]) => key.startsWith("treeCondition["))
        .map(([, value]) => value),
      photo: allPhotos, // Combine existing and new photos
    };

    // Update the tree
    const updatedTree = await Tree.findByIdAndUpdate(treeID, treeData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTree) {
      return NextResponse.json({ message: "Tree not found" }, { status: 404 });
    }

    revalidateTag("trees");

    return NextResponse.json({ message: "Success", data: updatedTree }, { status: 200 });
  } catch (error) {
    console.error("Error updating tree:", error);
    return NextResponse.json({ error: "Error processing form" }, { status: 500 });
  }
}
export async function GET(req: NextRequest, { params }: { params: Promise<{ treeID: string }> }) {
  await connectDB();

  try {
    const treeId = (await params).treeID; // Destructure treeId directly from params

    if (!treeId) {
      return new Response(JSON.stringify({ error: "Tree ID is required" }), {
        status: 400,
      });
    }

    const tree = await Tree.findById(treeId).lean();

    if (!tree) {
      return new Response(JSON.stringify({ message: "Tree not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(tree), { status: 200 });
  } catch (err) {
    let errorMessage = "An unknown error occurred";
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ treeID: string }> }) {
  await connectDB();

  try {
    const params1 = (await params).treeID; // Ensure params is awaited
    const treeId = params1; // Now safely access treeId

    if (!treeId) {
      return new Response(JSON.stringify({ error: "Tree ID is required" }), {
        status: 400,
      });
    }

    const deletedTree = await Tree.findByIdAndDelete(treeId).lean();

    if (!deletedTree) {
      return new Response(JSON.stringify({ message: "Tree not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Tree deleted successfully" }), {
      status: 200,
    });
  } catch (err) {
    let errorMessage = "An unknown error occurred";
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return new Response(JSON.stringify({ error: `Failed to delete tree: ${errorMessage}` }), {
      status: 500,
    });
  }
}
