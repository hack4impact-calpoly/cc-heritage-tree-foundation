import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import Tree, { ITree } from "@/database/treeSchema";
import s3 from "@/app/api/tree/aws";
import { revalidateTag } from "next/cache";
import { Buffer } from "buffer";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const formData = await req.formData();
    console.log(formData);

    // Get current count of trees to generate the next treeID
    const treeCount = await Tree.countDocuments();
    const nextTreeID = treeCount + 1;

    // Handle multiple file uploads
    const files = formData.getAll("files") as File[];
    const imageUrls: string[] = [];
    console.log(files);

    // Upload all files to S3
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = file.name;

        // Upload to S3
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
    console.log(imageUrls);

    // Collect the rest of the fields
    const treeData = {
      treeID: nextTreeID, // Add the sequential ID here
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
      photo: imageUrls,
    };

    const newTree = new Tree(treeData);
    const createdTree = await newTree.save();

    revalidateTag("trees");

    return NextResponse.json(
      {
        message: "Success",
        data: createdTree,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error submitting tree:", error);
    return NextResponse.json(
      {
        error: "Error processing form",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const collectorName = searchParams.get("collectorName");

  try {
    let trees;

    if (collectorName) {
      const decodedName = decodeURIComponent(collectorName);
      trees = await Tree.find({
        collectorName: { $regex: `^${decodedName}$`, $options: "i" },
      }).lean();
    } else {
      // Fetch all trees if no collectorName is provided
      trees = await Tree.find().lean();
    }

    const serializedTrees = trees.map((tree) => ({
      ...tree,
      gpsCoordinates: tree.gpsCoordinates.map((coord: any) => coord.toString()),
      dbh: tree.dbh.toString(),
      treeHeight: tree.treeHeight?.toString(),
      canopyBreadth: tree.canopyBreadth.toString(),
      treeQuality: tree.treeQuality.toString(),
      photos: tree.photos?.map((photo: any) => photo?.toString()), // Updated to handle array of photos
    }));

    return NextResponse.json(serializedTrees, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch trees: " + err }, { status: 400 });
  }
}
