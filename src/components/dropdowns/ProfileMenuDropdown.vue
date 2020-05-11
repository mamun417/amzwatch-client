<template>
    <q-btn size="sm" dense flat no-wrap>
        <q-avatar
            text-color="blue-grey-1"
            class="text-weight-bold"
            size="28px"
            icon="person"
            rounded
        ></q-avatar>
        <q-icon name="arrow_drop_down" size="16px"/>

        <q-menu>
            <q-list style="min-width: 230px">
                <q-item clickable>
                    <q-item-section class="col-auto">
                        <q-icon name="person"/>
                    </q-item-section>
                    <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item clickable>
                    <q-item-section class="col-auto">
                        <q-icon name="settings"/>
                    </q-item-section>
                    <q-item-section>Setting</q-item-section>
                </q-item>
            </q-list>
            <q-separator/>
            <div class="items-center column q-py-md">
                <q-avatar color="primary" text-color="blue-grey-1" size="76px" round>Y</q-avatar>
                <div class="text-subtitle2 q-mt-sm">John doe</div>
                <div class="text-caption">john@example.com</div>

                <q-btn
                    class="q-mt-md q-mx-md"
                    color="warning"
                    to="/auth/logout"
                    rounded dense flat stretch
                >Logout
                </q-btn>
            </div>
        </q-menu>
    </q-btn>
</template>