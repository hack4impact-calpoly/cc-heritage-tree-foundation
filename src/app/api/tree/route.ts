import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import Tree from "@/database/treeSchema";
import { revalidateTag } from "next/cache";

export async function GET(request: Request) {
  await connectDB();

  try {
    const trees = await Tree.find().lean();
    const serializedTrees = trees.map((tree) => ({
      ...tree,
      gpsCoordinates: tree.gpsCoordinates.map((coord: any) => coord.toString()),
      dbh: tree.dbh.toString(),
      canopyBreadth: tree.canopyBreadth.toString(),
    }));
    console.log(serializedTrees);
    return NextResponse.json(serializedTrees, { status: 200 });
  } catch (err) {
    return NextResponse.json("Failed to fetch trees: " + err, { status: 400 });
  }
}

// MOVED TO [treeID]/route.ts

// export async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
//   await connectDB();

//   try {
//     const tree = await Tree.findById(params.id).lean();
//     if (!tree) {
//       return NextResponse.json("Tree not found", { status: 404 });
//     }
//     return NextResponse.json(tree, { status: 200 });
//   } catch (err) {
//     return NextResponse.json("Failed to fetch tree: " + err, { status: 400 });
//   }
// }

export async function POST(req: NextRequest) {
  await connectDB();
  console.log("Received data: ", req.body);
  try {
    const treeData = await req.json();
    const newTree = new Tree(treeData);
    const createdTree = await newTree.save();
    revalidateTag("trees");
    return NextResponse.json(createdTree, { status: 200 });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error: any) => error.message);
      return NextResponse.json("Validation error: " + errors.join(", "), { status: 400 });
    } else {
      return NextResponse.json("Tree not added: " + err, { status: 400 });
    }
  }
}

// MOVED TO [treeID]/route.ts

// export async function DELETE(req: NextRequest) {
//   await connectDB();

//   try {
//     const { id } = await req.json();
//     const deletedTree = await Tree.findByIdAndDelete(id).lean();
//     revalidateTag("trees");
//     if (!deletedTree) {
//       return NextResponse.json("Tree not found", { status: 404 });
//     }
//     return NextResponse.json("Tree deleted successfully", { status: 200 });
//   } catch (err) {
//     return NextResponse.json("Failed to delete tree: " + err, { status: 400 });
//   }
// }
