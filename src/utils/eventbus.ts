import mitt from 'mitt';

const emitter = mitt();

/**
 * @description 由于Vue3 移除了实例自身的$on $emit等事件方法，此处需要单独引入
 */
const EventBus = {
  $on: emitter.on,
  $off: emitter.off,
  $emit: emitter.emit,
  all: emitter.all
};

export default EventBus;
export { EventBus };
