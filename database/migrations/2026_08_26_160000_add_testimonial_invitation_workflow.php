<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonial_invitations', function (Blueprint $table) {
            $table->id();
            $table->string('token', 64)->unique();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->foreignId('testimonial_invitation_id')
                ->nullable()
                ->after('id')
                ->unique()
                ->constrained()
                ->nullOnDelete();
            $table->string('status', 20)->default('approved')->after('author_company')->index();
            $table->timestamp('submitted_at')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropConstrainedForeignId('testimonial_invitation_id');
            $table->dropIndex(['status']);
            $table->dropColumn(['status', 'submitted_at']);
        });

        Schema::dropIfExists('testimonial_invitations');
    }
};
