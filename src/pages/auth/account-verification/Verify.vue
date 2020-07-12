<template>
    <div class="q-mt-lg q-pa-md">
        <q-card>
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">Verify Your Email Address</div>
            </q-card-section>
            <div class="q-pa-md">
                Before proceeding, Please check your email for a verification link. If you did not receive the email,
                <q-btn color="primary"
                   dense flat
                   class="text-primary"
                   :to="{name: 'verify.resend'}"
                >
                    click here to request another
                </q-btn>
            </div>
        </q-card>
    </div>
</template>

<script>

export default {
    name: 'Verify'
}
</script>
