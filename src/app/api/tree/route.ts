import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import Tree from "@/database/treeSchema";
import s3 from "@/app/api/tree/aws";
import { revalidateTag } from "next/cache";
import { Buffer } from "buffer";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    let imageUrl = "";

    if (file) {
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
      imageUrl = result.Location;
    }

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
      photo: imageUrl,
    };

    const newTree = new Tree(treeData);
    const createdTree = await newTree.save();

    revalidateTag("trees");

    return NextResponse.json({ message: "Success", data: createdTree }, { status: 200 });
  } catch (error) {
    console.error("Error submitting tree:", error);
    return NextResponse.json({ error: "Error processing form" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await connectDB();

  try {
    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const collectorName = searchParams.get("collectorName");

    // Build the query object
    const query: any = {};
    if (collectorName) {
      query.collectorName = collectorName;
    }

    // Find trees based on the query (filtered if collectorName exists)
    const trees = await Tree.find(query).lean();

    // Serialize the tree data
    const serializedTrees = trees.map((tree) => ({
      ...tree,
      gpsCoordinates: tree.gpsCoordinates.map((coord: any) => coord.toString()),
      dbh: tree.dbh.toString(),
      treeHeight: tree.treeHeight?.toString(),
      canopyBreadth: tree.canopyBreadth.toString(),
      treeQuality: tree.treeQuality.toString(),
      photo: tree.photo?.toString(),
    }));

    console.log(serializedTrees);
    return NextResponse.json(serializedTrees, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch trees: " + err }, { status: 400 });
  }
}
// export async function POST(req: NextRequest) {
//   await connectDB();
//   console.log("Received data: ", req.body);
//   try {
//     const treeData = await req.json();
//     const newTree = new Tree(treeData);
//     const createdTree = await newTree.save();
//     revalidateTag("trees");
//     return NextResponse.json(createdTree, { status: 200 });
//   } catch (err: any) {
//     if (err.name === "ValidationError") {
//       const errors = Object.values(err.errors).map((error: any) => error.message);
//       return NextResponse.json("Validation error: " + errors.join(", "), { status: 400 });
//     } else {
//       return NextResponse.json("Tree not added: " + err, { status: 400 });
//     }
//   }
// }
