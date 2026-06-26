import { NextRequest, NextResponse } from "next/server";
import {
  getAnnouncements, createAnnouncement, deleteAnnouncement,
  getCallRequests, createCallRequest, deleteCallRequest,
  getQuotationRequests, createQuotationRequest, deleteQuotationRequest,
  getReviews, createReview, deleteReview,
  getSubscribers, deleteSubscriber,
} from "@/lib/data/store";

type InboxType = "announcements" | "call-requests" | "quotation-requests" | "reviews" | "subscriptions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as InboxType | null;
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1);

  switch (type) {
    case "announcements":
      return NextResponse.json(getAnnouncements(page));
    case "call-requests":
      return NextResponse.json(getCallRequests(page));
    case "quotation-requests":
      return NextResponse.json(getQuotationRequests(page));
    case "reviews":
      return NextResponse.json(getReviews(page));
    case "subscriptions":
      return NextResponse.json(getSubscribers(page));
    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as InboxType | null;
    const body = await request.json();

    switch (type) {
      case "announcements":
        return NextResponse.json({ success: true, data: createAnnouncement(body) }, { status: 201 });
      case "call-requests":
        return NextResponse.json({ success: true, data: createCallRequest(body) }, { status: 201 });
      case "quotation-requests":
        return NextResponse.json({ success: true, data: createQuotationRequest(body) }, { status: 201 });
      case "reviews":
        return NextResponse.json({ success: true, data: createReview(body) }, { status: 201 });
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as InboxType | null;
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  switch (type) {
    case "announcements":
      if (id) deleteAnnouncement(Number(id));
      break;
    case "call-requests":
      if (id) deleteCallRequest(Number(id));
      break;
    case "quotation-requests":
      if (id) deleteQuotationRequest(Number(id));
      break;
    case "reviews":
      if (id) deleteReview(Number(id));
      break;
    case "subscriptions":
      if (email) deleteSubscriber(email);
      break;
    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
