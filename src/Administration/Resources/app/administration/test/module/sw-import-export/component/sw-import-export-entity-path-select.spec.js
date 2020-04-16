import { createLocalVue, shallowMount } from '@vue/test-utils';
import 'src/app/component/form/select/base/sw-select-base';
import 'src/app/component/form/field-base/sw-block-field';
import 'src/app/component/form/field-base/sw-base-field';
import 'src/app/component/form/field-base/sw-field-error';
import 'src/app/component/form/select/base/sw-select-result-list';
import 'src/app/component/utils/sw-popover';
import 'src/app/component/form/select/base/sw-select-result';
import 'src/app/component/base/sw-highlight-text';
import 'src/module/sw-import-export/component/sw-import-export-entity-path-select';

const EntityDefinitionFactory = require('src/core/factory/entity-definition.factory').default;

describe('module/sw-import-export/components/sw-import-export-entity-path-select', () => {
    let wrapper;
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.directive('popover', {});

        const mockEntitySchema = {
            product: {
                entity: 'product',
                properties: {
                    id: {
                        type: 'uuid'
                    },
                    price: {
                        type: 'json_object',
                        properties: []
                    },
                    parent: {
                        type: 'association',
                        relation: 'many_to_one',
                        entity: 'product'
                    },
                    cover: {
                        type: 'association',
                        relation: 'many_to_one',
                        entity: 'product_media'
                    },
                    name: {
                        type: 'string'
                    },
                    manufacturer: {
                        type: 'association',
                        relation: 'many_to_one',
                        entity: 'product_manufacturer'
                    },
                    translations: {
                        type: 'association',
                        relation: 'one_to_many',
                        entity: 'product_translation'
                    },
                    visibilities: {
                        type: 'association',
                        relation: 'one_to_many',
                        entity: 'product_visibilities'
                    }
                }
            },
            product_translation: {
                entity: 'product_translation',
                properties: {
                    name: {
                        type: 'string'
                    }
                }
            },
            product_manufacturer: {
                entity: 'product_manufacturer',
                properties: {
                    id: {
                        type: 'uuid'
                    },
                    name: {
                        type: 'string'
                    },
                    media: {
                        type: 'association',
                        relation: 'many_to_one',
                        entity: 'media'
                    },
                    products: {
                        type: 'association',
                        relation: 'one_to_many',
                        entity: 'product'
                    }
                }
            },
            product_media: {
                entity: 'product_media',
                properties: {
                    id: {
                        type: 'uuid'
                    },
                    media: {
                        type: 'association',
                        relation: 'many_to_one',
                        entity: 'media'
                    }
                }
            },
            media: {
                entity: 'media',
                properties: {
                    id: {
                        type: 'uuid'
                    },
                    translations: {
                        type: 'association',
                        relation: 'one_to_many',
                        entity: 'media_translation'
                    }
                }
            },
            media_translation: {
                entity: 'media_translation',
                properties: {
                    title: {
                        type: 'string'
                    }
                }
            }
        };

        Shopware.EntityDefinition = EntityDefinitionFactory;
        Object.keys(mockEntitySchema).forEach((entity) => {
            Shopware.EntityDefinition.add(entity, mockEntitySchema[entity]);
        });

        wrapper = shallowMount(Shopware.Component.build('sw-import-export-entity-path-select'), {
            localVue,
            stubs: {
                'sw-select-base': Shopware.Component.build('sw-select-base'),
                'sw-block-field': Shopware.Component.build('sw-block-field'),
                'sw-base-field': Shopware.Component.build('sw-base-field'),
                'sw-icon': '<div></div>',
                'sw-field-error': Shopware.Component.build('sw-field-error'),
                'sw-select-result-list': Shopware.Component.build('sw-select-result-list'),
                'sw-popover': Shopware.Component.build('sw-popover'),
                'sw-select-result': Shopware.Component.build('sw-select-result'),
                'sw-highlight-text': Shopware.Component.build('sw-highlight-text')
            },
            propsData: {
                value: null,
                entityType: 'product'
            }
        });
    });

    afterEach(() => {
        localVue = null;
        wrapper.destroy();
    });

    it('should be a Vue.js component', () => {
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('should return array when calling `actualPathParts` computed property', () => {
        wrapper.setProps({
            value: 'media.id.'
        });

        expect(wrapper.vm.actualPathParts).toEqual(['media', 'id']);
    });

    it('should return valid price properties on `getPriceProperties` with given currencies', () => {
        wrapper.setProps({
            currencies: [
                { isoCode: 'EUR' },
                { isoCode: 'USD' }
            ]
        });

        const actual = wrapper.vm.getPriceProperties('');
        const expected = [
            { label: 'price.EUR.net', value: 'price.EUR.net' },
            { label: 'price.EUR.gross', value: 'price.EUR.gross' },
            { label: 'price.EUR.currencyId', value: 'price.EUR.currencyId' },
            { label: 'price.EUR.linked', value: 'price.EUR.linked' },
            { label: 'price.EUR.listPrice', value: 'price.EUR.listPrice' },
            { label: 'price.USD.net', value: 'price.USD.net' },
            { label: 'price.USD.gross', value: 'price.USD.gross' },
            { label: 'price.USD.currencyId', value: 'price.USD.currencyId' },
            { label: 'price.USD.linked', value: 'price.USD.linked' },
            { label: 'price.USD.listPrice', value: 'price.USD.listPrice' }
        ];

        expect(actual).toEqual(expected);
    });

    it('should return valid price properties on `getPriceProperties` with given currencies and path set', () => {
        wrapper.setProps({
            currencies: [
                { isoCode: 'EUR' },
                { isoCode: 'USD' }
            ]
        });

        const actual = wrapper.vm.getPriceProperties('parent.');
        const expected = [
            { label: 'parent.price.EUR.net', value: 'parent.price.EUR.net' },
            { label: 'parent.price.EUR.gross', value: 'parent.price.EUR.gross' },
            { label: 'parent.price.EUR.currencyId', value: 'parent.price.EUR.currencyId' },
            { label: 'parent.price.EUR.linked', value: 'parent.price.EUR.linked' },
            { label: 'parent.price.EUR.listPrice', value: 'parent.price.EUR.listPrice' },
            { label: 'parent.price.USD.net', value: 'parent.price.USD.net' },
            { label: 'parent.price.USD.gross', value: 'parent.price.USD.gross' },
            { label: 'parent.price.USD.currencyId', value: 'parent.price.USD.currencyId' },
            { label: 'parent.price.USD.linked', value: 'parent.price.USD.linked' },
            { label: 'parent.price.USD.listPrice', value: 'parent.price.USD.listPrice' }
        ];

        expect(actual).toEqual(expected);
    });

    it('should return valid price properties when getting price properties without given currencies', () => {
        const actual = wrapper.vm.getPriceProperties('');
        const expected = [
            { label: 'price.DEFAULT.net', value: 'price.DEFAULT.net' },
            { label: 'price.DEFAULT.gross', value: 'price.DEFAULT.gross' },
            { label: 'price.DEFAULT.currencyId', value: 'price.DEFAULT.currencyId' },
            { label: 'price.DEFAULT.linked', value: 'price.DEFAULT.linked' },
            { label: 'price.DEFAULT.listPrice', value: 'price.DEFAULT.listPrice' }
        ];

        expect(actual).toEqual(expected);
    });

    it('should return valid visibility properties on `getVisibilityProperties` with given visibilities', () => {
        const actual = wrapper.vm.getVisibilityProperties('');
        const expected = [
            { label: 'visibilities.all', value: 'visibilities.all' },
            { label: 'visibilities.link', value: 'visibilities.link' },
            { label: 'visibilities.search', value: 'visibilities.search' }
        ];

        expect(actual).toEqual(expected);
    });

    it('should return valid translation properties on `getTranslationProperties', () => {
        const mockProperties = [
            'metaDescription',
            'keywords',
            'description'
        ];

        wrapper.setProps({
            languages: [
                { locale: { code: 'en-GB' } },
                { locale: { code: 'de-DE' } },
                { locale: { code: 'DEFAULT' } }
            ]
        });

        const actual = wrapper.vm.getTranslationProperties('', mockProperties);

        const expected = [
            { label: 'translations.en-GB.metaDescription', value: 'translations.en-GB.metaDescription' },
            { label: 'translations.en-GB.keywords', value: 'translations.en-GB.keywords' },
            { label: 'translations.en-GB.description', value: 'translations.en-GB.description' },
            { label: 'translations.de-DE.metaDescription', value: 'translations.de-DE.metaDescription' },
            { label: 'translations.de-DE.keywords', value: 'translations.de-DE.keywords' },
            { label: 'translations.de-DE.description', value: 'translations.de-DE.description' },
            { label: 'translations.DEFAULT.metaDescription', value: 'translations.DEFAULT.metaDescription' },
            { label: 'translations.DEFAULT.keywords', value: 'translations.DEFAULT.keywords' },
            { label: 'translations.DEFAULT.description', value: 'translations.DEFAULT.description' }
        ];

        expect(actual).toEqual(expected);
    });

    it('should return media properties for product cover media value', () => {
        wrapper.setProps({
            value: 'cover.media.',
            languages: [
                { locale: { code: 'en-GB' } },
                { locale: { code: 'de-DE' } },
                { locale: { code: 'DEFAULT' } }
            ]
        });

        const actual = wrapper.vm.visibleResults;

        const expected = [
            {
                label: 'cover.media.id',
                value: 'cover.media.id',
                relation: undefined
            },
            {
                label: 'cover.media.translations.DEFAULT.title',
                value: 'cover.media.translations.DEFAULT.title'
            },
            {
                label: 'cover.media.translations.de-DE.title',
                value: 'cover.media.translations.de-DE.title'
            },
            {
                label: 'cover.media.translations.en-GB.title',
                value: 'cover.media.translations.en-GB.title'
            }
        ];
        expect(actual).toEqual(expected);
    });

    it('should return product translation properties for product parent parent translation value', () => {
        wrapper.setProps({
            value: 'parent.parent.translations.name',
            languages: [
                { locale: { code: 'en-GB' } },
                { locale: { code: 'de-DE' } },
                { locale: { code: 'DEFAULT' } }
            ]
        });

        const actual = wrapper.vm.visibleResults;

        const expected = [
            {
                label: 'parent.parent.translations.en-GB.name',
                value: 'parent.parent.translations.en-GB.name'
            },
            {
                label: 'parent.parent.translations.de-DE.name',
                value: 'parent.parent.translations.de-DE.name'
            },
            {
                label: 'parent.parent.translations.DEFAULT.name',
                value: 'parent.parent.translations.DEFAULT.name'
            }
        ];

        expect(actual).toEqual(expect.arrayContaining(expected));
    });

    it('should return filtered product properties when searching', () => {
        wrapper.setProps({
            value: 'parent.parent.',
            languages: [
                { locale: { code: 'DEFAULT' } }
            ]
        });
        wrapper.vm.actualSearch = 'parent.parent.price';

        const actual = wrapper.vm.visibleResults;

        const expected = [
            {
                label: 'parent.parent.price.DEFAULT.currencyId',
                value: 'parent.parent.price.DEFAULT.currencyId'
            },
            {
                label: 'parent.parent.price.DEFAULT.gross',
                value: 'parent.parent.price.DEFAULT.gross'
            },
            {
                label: 'parent.parent.price.DEFAULT.linked',
                value: 'parent.parent.price.DEFAULT.linked'
            },
            {
                label: 'parent.parent.price.DEFAULT.listPrice',
                value: 'parent.parent.price.DEFAULT.listPrice'
            },
            {
                label: 'parent.parent.price.DEFAULT.net',
                value: 'parent.parent.price.DEFAULT.net'
            }
        ];

        expect(actual).toEqual(expected);
    });

    it('should process translations, prices visibilities and remove property from properties array', () => {
        wrapper.setProps({
            value: '',
            languages: [
                { locale: { code: 'DEFAULT' } }
            ]
        });

        const definition = Shopware.EntityDefinition.get('product');

        let data = {
            definition: definition,
            options: [],
            properties: Object.keys(definition.properties),
            path: ''
        };

        expect(data.properties).toEqual(
            ['id', 'price', 'parent', 'cover', 'name', 'manufacturer', 'translations', 'visibilities']
        );

        data = wrapper.vm.processTranslations(data);

        expect(data.properties).toEqual(['id', 'price', 'parent', 'cover', 'manufacturer', 'visibilities']);
        expect(data.options).toEqual([{
            label: 'translations.DEFAULT.name',
            value: 'translations.DEFAULT.name'
        }]);

        data = wrapper.vm.processVisibilities(data);

        expect(data.properties).toEqual(['id', 'price', 'parent', 'cover', 'manufacturer']);
        expect(data.options).toEqual([
            { label: 'translations.DEFAULT.name', value: 'translations.DEFAULT.name' },
            { label: 'visibilities.all', value: 'visibilities.all' },
            { label: 'visibilities.link', value: 'visibilities.link' },
            { label: 'visibilities.search', value: 'visibilities.search' }
        ]);

        data = wrapper.vm.processPrice(data);

        expect(data.properties).toEqual(['id', 'parent', 'cover', 'manufacturer']);
        expect(data.options).toEqual([
            { label: 'translations.DEFAULT.name', value: 'translations.DEFAULT.name' },
            { label: 'visibilities.all', value: 'visibilities.all' },
            { label: 'visibilities.link', value: 'visibilities.link' },
            { label: 'visibilities.search', value: 'visibilities.search' },
            { label: 'price.DEFAULT.net', value: 'price.DEFAULT.net' },
            { label: 'price.DEFAULT.gross', value: 'price.DEFAULT.gross' },
            { label: 'price.DEFAULT.currencyId', value: 'price.DEFAULT.currencyId' },
            { label: 'price.DEFAULT.linked', value: 'price.DEFAULT.linked' },
            { label: 'price.DEFAULT.listPrice', value: 'price.DEFAULT.listPrice' }
        ]);
    });

    it('should sort options', () => {
        const options = [
            { label: 'name', value: 'name' },
            { label: 'media', value: 'media' },
            { label: 'media', value: 'media' },
            { label: 'id', value: 'id' },
            { label: 'cover', value: 'cover' }
        ];

        const actual = options.sort(wrapper.vm.sortOptions);

        expect(actual).toEqual([
            { label: 'cover', value: 'cover' },
            { label: 'id', value: 'id' },
            { label: 'media', value: 'media' },
            { label: 'media', value: 'media' },
            { label: 'name', value: 'name' }
        ]);
    });
});