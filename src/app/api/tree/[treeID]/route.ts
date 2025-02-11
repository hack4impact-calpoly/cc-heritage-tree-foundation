import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/database/db";
import Tree from "../../../../database/treeSchema";
import { NextRequest } from "next/server";

type IParams = {
  params: {
    treeId: string;
  };
};

export async function PUT(req: NextRequest, { params }: IParams) {
  await connectDB();

  try {
    const { treeId } = params; // Get treeId from params
    const body = await req.json();

    const updatedTree = await Tree.findByIdAndUpdate(treeId, body, {
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

export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();

  try {
    const { treeId } = params; // Destructure treeId directly from params

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

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB();

  try {
    const params1 = params; // Ensure params is awaited
    const treeId = params1.treeId; // Now safely access treeId

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
