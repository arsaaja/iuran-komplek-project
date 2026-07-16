<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'ktp_photo' => ['nullable', 'image', 'max:2048'],
            'resident_type' => ['required', 'in:tetap,kontrak'],
            'phone_number' => ['required', 'string', 'max:20'],
            'marital_status' => ['required', 'in:lajang,menikah,cerai'],
        ];
    }

    public function messages(): array
    {
        return [
            'ktp_photo.image' => 'File foto KTP harus berupa gambar.',
            'ktp_photo.max' => 'Ukuran foto KTP maksimal 2MB.',
        ];
    }
}
