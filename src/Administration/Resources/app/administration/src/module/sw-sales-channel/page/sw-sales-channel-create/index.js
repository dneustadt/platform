import template from './sw-sales-channel-create.html.twig';

const { Component } = Shopware;
const utils = Shopware.Utils;

Component.extend('sw-sales-channel-create', 'sw-sales-channel-detail', {
    template,

    beforeRouteEnter(to, from, next) {
        if (to.name.includes('sw.sales.channel.create') && !to.params.id) {
            to.params.id = utils.createId();
        }

        next();
    },

    methods: {
        createdComponent() {
            if (!this.$route.params.typeId) {
                return;
            }

            if (!Shopware.State.getters['context/isSystemDefaultLanguage']) {
                Shopware.State.commit('context/resetLanguageToDefault');
            }

            this.salesChannel = this.salesChannelRepository.create(Shopware.Context.api);
            this.salesChannel.typeId = this.$route.params.typeId;
            this.salesChannel.active = false;

            this.$super('createdComponent');
        },

        saveFinish() {
            this.isSaveSuccessful = false;
            this.$router.push({ name: 'sw.sales.channel.detail', params: { id: this.salesChannel.id } });
        },

        onSave() {
            this.$super('onSave');
        }
    }
});
