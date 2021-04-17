import { mount } from "@vue/test-utils";
import Menu from "@/components/Menu.vue";

describe("Компонент Menu", () => {
  const wrapper = mount(Menu);

  it("отображает корректную разметку", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
