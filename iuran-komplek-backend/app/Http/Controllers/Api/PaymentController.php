<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    public function index(Request $request): JsonResponse
    {
        $payments = Payment::query()
            ->with(['resident', 'house', 'items.dueType'])
            ->when($request->filled('resident_id'), fn ($q) => $q->where('resident_id', $request->resident_id))
            ->when($request->filled('house_id'), fn ($q) => $q->where('house_id', $request->house_id))
            ->orderByDesc('payment_date')
            ->paginate($request->integer('per_page', 15));

        return response()->json(PaymentResource::collection($payments)->response()->getData(true));
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $payment = $this->paymentService->store($request->validated(), $request->user()?->id);

        return response()->json(new PaymentResource($payment->load('resident', 'house')), 201);
    }

    public function show(Payment $payment): JsonResponse
    {
        return response()->json(new PaymentResource($payment->load('resident', 'house', 'items.dueType')));
    }
}
