<template>
    <q-dialog
        :value="show"
        @input="$emit('update:show', $event)"
    >
        <q-card style="min-width: 400px">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">Update Guest Link Checker Service</div>
            </q-card-section>

            <q-card-section class="text-center q-pt-xl">
                <div class="q-mb-lg">
                    <div class="text-caption q-mb-sm">Please fill guest domain url first</div>
                    <q-input
                        v-model="guestDomain"
                        label="Guest domain url"
                        class="q-mx-md" standout="bg-primary text-white"
                        hint="without path. ex. https://exonhost.com"
                        error-message="invalid domain url"
                        :error="guestDomainInvalid"
                        @focus="guestDomainInputFocused = true"
                        @blur="guestDomainInputFocused = false"
                        dense
                    />
                </div>

                <q-list v-show="guestDomain && !guestDomainInvalid && !guestDomainInputFocused">
                    <q-item
                        v-if=""
                        v-for="(gl, key) in guestLinksForUpdate"
                        :key="key" clickable
                    >
                        <div class="items-center row">
                            <q-btn
                                @click="$delete(guestLinksForUpdate, key)"
                                :label="key + 1"
                                color="primary"
                                class="q-mr-sm"
                                flat
                            />
                        </div>

                        <div class="row">
                            <q-input
                                v-model="gl.guestUrl"
                                label="Guest URL"
                                class="col-12 q-mb-xs" standout="bg-primary text-white"
                                error-message="path must start with / or keep blank"
                                :prefix="guestDomain" :error="gl.guestUrlError"
                                stack-label dense hide-bottom-space
                            />
                            <q-input
                                v-model="gl.hostedUrl"
                                label="Hosted URL"
                                class="col-12" standout="bg-primary text-white"
                                error-message="path must start with / or keep blank"
                                :prefix="projectInfo.domain.url" :error="gl.hostedUrlError"
                                stack-label dense hide-bottom-space
                            />
                        </div>

                        <div class="items-center row">
                            <q-btn
                                v-if="guestLinksForUpdate.length > 1"
                                @click="$delete(guestLinksForUpdate, key)"
                                icon="clear" color="warning"
                                class="q-ml-sm" size="sm"
                                dense
                            />
                        </div>
                    </q-item>

                    <div class="text-xs text-grey-8 q-mt-sm">Note: Keep blank if you want to use home url & for path
                        start with /
                    </div>

                    <q-btn
                        @click="pushToGuestLinksForUpdate"
                        color="primary" label="Add another url"
                        no-caps size="sm" class="q-mt-md"
                    />
                </q-list>

                <div class="text-left q-mt-lg">
                    <q-toggle
                        v-model="status"
                        true-value="active" false-value="inactive"
                        checked-icon="done" unchecked-icon="clear"
                        :label="status"
                        color=""
                    />
                </div>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn
                    label="Update" class="q-mr-md"
                    :disable="guestDomainInvalid || !guestDomain"
                    @click="serviceActivateDeactivateHandle"
                    flat
                />
            </q-card-actions>

            <q-inner-loading color="primary" :showing="!!singleLoader.guestLinkCheckerUpdateLoader"/>

        </q-card>
    </q-dialog>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        props   : {
            show       : {
                type   : Boolean,
                default: false
            },
            projectInfo: {
                type   : Object,
                default: () => ({})
            }
        },
        data() {
            return {
                guestDomain            : '',
                guestDomainInputFocused: true,
                guestLinksForUpdate    : [
                    {
                        guestUrl      : '',
                        guestUrlError : false,
                        hostedUrl     : '',
                        hostedUrlError: false
                    }
                ],
                status                 : 'active'
            }
        },
        computed: {
            guestDomainInvalid() {
                return !this.guestDomainInputFocused
                    && (!this.guestDomain || !this.guestDomain.includes('://'))
            },
            ...mapGetters({
                singleLoader : 'ui/singleLoaderStatus'
            })
        },
        methods : {
            pushToGuestLinksForUpdate() {
                this.guestLinksForUpdate.push({
                    guestUrl      : '',
                    guestUrlError : false,
                    hostedUrl     : '',
                    hostedUrlError: false
                })
            },

            serviceActivateDeactivateHandle() {

                this.$singleLoaderTrue('guestLinkCheckerUpdateLoader');
                this.$forceUpdate();

                let guestLinks = []

                this.guestLinksForUpdate.map((obj, key) => {
                    guestLinks.push({
                        guest_post_url: `${this.guestDomain}${obj.guestUrl}`,
                        holding_url   : `${this.projectInfo.domain.url}${obj.hostedUrl}`
                    })
                })
                this.$store.dispatch('guest_links/updateGuestPostsCheckService', {
                    vm        : this,
                    project_id: this.projectInfo.id,
                    inputs    : {
                        guest_domain: this.guestDomain,
                        urls        : guestLinks,
                        status      : this.status
                    }
                })
                    .then(res => {
                        this.$singleLoaderFalse('guestLinkCheckerUpdateLoader');
                        this.$forceUpdate();

                        this.$q.notify({
                            color   : 'positive',
                            message : 'Guest link checker service has been updated Successful',
                            position: 'top'
                        });

                        this.$emit('serviceUpdated', res.data.project);
                        this.$emit('update:show', false);
                    })
                    .catch(err => {
                        this.$singleLoaderFalse('guestLinkCheckerUpdateLoader');
                        this.$forceUpdate();
                        //handle error
                    });
            }
        },
        watch   : {
            projectInfo        : {
                handler() {
                    if (this.projectInfo.id) {
                        if (
                            this.projectInfo.hasOwnProperty('domain_use_for')
                            && this.projectInfo.domain_use_for.hasOwnProperty('guest_posts_check_service')
                        ) {
                            let status = this.projectInfo.domain_use_for.guest_posts_check_service.status;

                            this.status = status || 'inactive'
                        }

                        this.$store.dispatch('guest_links/getAllGuestPosts', {
                            vm        : this,
                            project_id: this.projectInfo.id
                        })
                            .then(res => {
                                let guestPosts = res.data.linksInGuestPosts.data;

                                if (guestPosts.length) {
                                    this.guestLinksForUpdate     = [];
                                    this.guestDomainInputFocused = false;
                                }

                                guestPosts.map((obj, key) => {
                                    let parsedGuestUrl  = new URL(obj.guest_post_url)
                                    let parsedHostedUrl = new URL(obj.holding_url)

                                    this.guestDomain = parsedGuestUrl.origin

                                    this.guestLinksForUpdate.push({
                                        guestUrl : parsedGuestUrl.pathname,
                                        hostedUrl: parsedHostedUrl.pathname
                                    })
                                })
                            })
                            .catch(err => {
                                //handle error
                            })
                    }
                },
                deep     : true,
                immediate: true
            },
            guestLinksForUpdate: {
                handler() {
                    this.guestLinksForUpdate.map((obj, key) => {
                        obj.guestUrlError  = !!obj.guestUrl && obj.guestUrl[0] !== '/'
                        obj.hostedUrlError = !!obj.hostedUrl && obj.hostedUrl[0] !== '/'
                    })
                },
                deep: true
            }
        }
    }
</script>
