import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/database/db";
import Tree from "../../../../database/treeSchema";
import { NextRequest } from "next/server";

export async function PUT(req: Request, { params }: { params: { treeID: string } }) {
  await connectDB();

  try {
    const { treeID } = params; // Get treeID from params
    const body = await req.json();

    const updatedTree = await Tree.findByIdAndUpdate(treeID, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTree) {
      return new Response(JSON.stringify({ message: "Tree not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedTree), { status: 200 });
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

export async function GET(req: NextRequest, context: { params: { treeID: string } }) {
  await connectDB();

  try {
    const { treeID } = await context.params; // Destructure treeID directly from params

    if (!treeID) {
      return new Response(JSON.stringify({ error: "Tree ID is required" }), {
        status: 400,
      });
    }

    const tree = await Tree.findById(treeID).lean();

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

export async function DELETE(req: Request, context: { params: { treeID?: string } }) {
  await connectDB();

  try {
    const params = await context.params; // Ensure params is awaited
    const treeID = params.treeID; // Now safely access treeID

    if (!treeID) {
      return new Response(JSON.stringify({ error: "Tree ID is required" }), {
        status: 400,
      });
    }

    const deletedTree = await Tree.findByIdAndDelete(treeID).lean();

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
