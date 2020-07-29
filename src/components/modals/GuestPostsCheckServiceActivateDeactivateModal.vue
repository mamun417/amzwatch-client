<template>
    <q-dialog :value="show" @input="$emit('update:show', $event)">
        <q-card style="min-width: 400px">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">Update Guest Link Checker Service</div>
            </q-card-section>

            <q-card-section class="text-center q-pt-xl">
                <q-list>
                    <q-item v-for="(gl, key) in guestLinksForUpdate" :key="key" clickable>
                        <div class="items-center row">
                            <q-btn :label="key + 1" class="q-mr-sm" flat />
                        </div>

                        <div class="row">
                            <q-input
                                v-model="gl.guestUrl"
                                label="Guest URL"
                                class="col-12 q-mb-xs"
                                standout="bg-primary text-white"
                                error-message="Input valid guest url"
                                :error="gl.guestUrlError"
                                stack-label
                                dense
                                hide-bottom-space
                            />
                            <q-input
                                v-model="gl.hostedUrl"
                                label="My URL"
                                class="col-12"
                                standout="bg-primary text-white"
                                error-message="path must start with / or keep blank"
                                :prefix="projectInfo.domain.url"
                                :error="gl.hostedUrlError"
                                stack-label
                                dense
                                hide-bottom-space
                            />
                        </div>

                        <div class="items-center row">
                            <q-btn
                                v-if="guestLinksForUpdate.length > 1"
                                @click="$delete(guestLinksForUpdate, key)"
                                icon="clear"
                                color="warning"
                                class="q-ml-sm"
                                size="sm"
                                dense
                            />
                        </div>
                    </q-item>

                    <div class="text-xs text-grey-8 q-mt-sm">
                        Note: Keep blank if you want to use home url & for path
                        start with /
                    </div>

                    <q-btn
                        @click="pushToGuestLinksForUpdate"
                        color="primary"
                        label="Add another url"
                        no-caps
                        size="sm"
                        class="q-mt-md"
                    />
                </q-list>

                <div class="text-left q-mt-lg">
                    <q-toggle
                        v-model="status"
                        true-value="active"
                        false-value="inactive"
                        checked-icon="done"
                        unchecked-icon="clear"
                        :label="status"
                        color
                    />
                </div>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn
                    label="Update"
                    class="q-mr-md"
                    @click="serviceActivateDeactivateHandle"
                    flat
                />
            </q-card-actions>

            <q-inner-loading
                color="primary"
                :showing="!!singleLoader.guestLinkCheckerUpdateLoader"
            />
        </q-card>
    </q-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        projectInfo: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            guestLinksForUpdate: [
                {
                    guestUrl: "",
                    guestUrlError: false,
                    hostedUrl: "",
                    hostedUrlError: false,
                },
            ],
            status: "active",
        };
    },
    computed: {
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus",
        }),

        updateDisabled() {
            let status = false;

            this.guestLinksForUpdate.forEach((v) => {
                if (
                    !v.guestUrl ||
                    (v.guestUrl && !v.guestUrlError) ||
                    (v.hostedUrl && v.hostedUrl[0] !== "/")
                )
                    status = true;
            });

            return status;
        },
    },
    methods: {
        pushToGuestLinksForUpdate() {
            this.guestLinksForUpdate.push({
                guestUrl: "",
                guestUrlError: false,
                hostedUrl: "",
                hostedUrlError: false,
            });
        },

        serviceActivateDeactivateHandle() {
            this.$singleLoaderTrue("guestLinkCheckerUpdateLoader");

            let guestLinks = [];

            this.guestLinksForUpdate.map((obj, key) => {
                guestLinks.push({
                    guest_post_url: obj.guestUrl,
                    holding_url: `${this.projectInfo.domain.url}${obj.hostedUrl}`,
                });
            });
            this.$store
                .dispatch("guest_links/updateGuestPostsCheckService", {
                    vm: this,
                    project_id: this.projectInfo.id,
                    inputs: {
                        urls: guestLinks,
                        status: this.status,
                    },
                })
                .then((res) => {
                    this.$singleLoaderFalse("guestLinkCheckerUpdateLoader");

                    this.$q.notify({
                        color: "positive",
                        message:
                            "Guest link checker service has been updated Successful",
                        position: "top",
                    });

                    this.$emit("serviceUpdated", res.data.project);
                    this.$emit("update:show", false);
                })
                .catch((err) => {
                    this.$singleLoaderFalse("guestLinkCheckerUpdateLoader");
                    //handle error
                });
        },
    },
    watch: {
        projectInfo: {
            handler() {
                if (this.projectInfo.id) {
                    this.$singleLoaderTrue("guestLinkCheckerUpdateLoader");

                    if (
                        this.projectInfo.hasOwnProperty("domain_use_for") &&
                        this.projectInfo.domain_use_for.hasOwnProperty(
                            "guest_posts_check_service"
                        )
                    ) {
                        let status = this.projectInfo.domain_use_for
                            .guest_posts_check_service.status;

                        this.status = status || "inactive";
                    }

                    this.$store
                        .dispatch("guest_links/getAllGuestPosts", {
                            vm: this,
                            project_id: this.projectInfo.id,
                        })
                        .then((res) => {
                            let guestPosts = res.data.linksInGuestPosts.data;

                            if (guestPosts.length) {
                                this.guestLinksForUpdate = [];
                            }

                            guestPosts.map((obj, key) => {
                                let parsedHostedUrl = new URL(obj.holding_url);

                                this.guestLinksForUpdate.push({
                                    guestUrl: obj.guest_post_url,
                                    hostedUrl: parsedHostedUrl.pathname,
                                });
                            });

                            this.$singleLoaderFalse(
                                "guestLinkCheckerUpdateLoader"
                            );
                        })
                        .catch((err) => {
                            this.$singleLoaderFalse(
                                "guestLinkCheckerUpdateLoader"
                            );
                        });
                }
            },
            deep: true,
            immediate: true,
        },
        guestLinksForUpdate: {
            handler() {
                this.guestLinksForUpdate.map((obj, key) => {
                    if (obj.guestUrl) {
                        try {
                            let parsedGuestdUrl = new URL(obj.guestUrl);

                            // obj.guestUrlError = !!!parsedGuestdUrl.origin;
                            obj.guestUrlError =
                                !!!parsedGuestdUrl.origin ||
                                (this.projectInfo.domain &&
                                    parsedGuestdUrl.origin ===
                                        this.projectInfo.domain.url);
                        } catch {
                            obj.guestUrlError = true;
                        }
                    } else {
                        obj.guestUrlError = true;
                    }

                    obj.hostedUrlError =
                        !!obj.hostedUrl && obj.hostedUrl[0] !== "/";
                });
            },
            deep: true,
        },
    },
};
</script>
