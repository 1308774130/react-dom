import { Placement } from "./utils"

//把vnode转成fiber
export function createFiber(vnode,returnFiber){
    const fiber = {
        type:vnode.type,//tag(原生标签host string，函数组件functioin，类组件class)
        key:vnode.key,//唯一标记符
        props:vnode.props,//属性
        child:null,//第一个子节点#fiber
        sibling:null,//下一个兄弟节点#fiber
        return:returnFiber,//父节点#fiber
        index:0,//标记当前层级下的位置
        stateNode:null,//实际节点真身（是dom节点还是class实例）
        flags:Placement//(标记fiber是干嘛的，插入更新删除)
    }
    return fiber
}