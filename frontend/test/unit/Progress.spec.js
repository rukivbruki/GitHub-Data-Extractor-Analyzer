import { mount } from '@vue/test-utils';
import Progress from "@/components/Progress.vue";

describe('Компонент Progress', () => {
    const wrapper = mount(Progress)

    it('отображает корректную разметку', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });
})