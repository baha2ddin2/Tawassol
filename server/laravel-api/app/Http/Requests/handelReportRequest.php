<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class handelReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(){
        return [
            'action' => 'required|string|in:delete,warn,block,ignore',
        ];
    }

    public function messages(){
        return [
            'action.required' => 'You must provide an action to handle this report.',
            'action.in' => 'Invalid action. Allowed values: delete, warn, block, ignore.',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'errors'=> $validator->errors()
            ],422));
    }
}
