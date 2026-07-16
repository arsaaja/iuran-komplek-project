<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id' => ['required', 'exists:residents,id'],
            'house_id' => ['required', 'exists:houses,id'],
            'payment_date' => ['required', 'date'],
            'note' => ['nullable', 'string', 'max:255'],

            // Bisa bayar beberapa jenis iuran & beberapa bulan sekaligus (mis. 1 tahun)
            'items' => ['required', 'array', 'min:1'],
            'items.*.due_type_id' => ['required', 'exists:due_types,id'],
            'items.*.period_month' => ['required', 'integer', 'min:1', 'max:12'],
            'items.*.period_year' => ['required', 'integer', 'min:2000', 'max:2100'],
        ];
    }
}
