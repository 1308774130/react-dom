import { createFiber } from "./fiber";
import { isArray, isStr } from "./utils";
import { updateNode } from "./react-dom";


/**
 * 原生dom标签
 * 1.更新节点本身
 * 2.遍历子节点
 */
export function updateHostComponent(wip) {
    //先判断是不是生成过节点了
    if (!wip.stateNode) {
        wip.stateNode = createNode(wip)
    }
    reconcileChildren(wip, wip.props.children)
}
/**
 * 函数组件
 * 协调子节点
 */
export function updateFunctionComponent(wip){
    //需要执行这个函数才能拿到函数组件内部的子节点
    // console.log(wip)
    //type是函数本体,props是函数入参
    const {type,props} = wip
    const children = type(props)
    reconcileChildren(wip, children)

}
/**
 * 接受jsx转换成正常dom
 * 1.把父节点转成正常dom =》node
 * 2.把父节点属性挂载在node上 =》updateNode
 * 3.循环遍历子节点 =》reconcileChildren
 */
function createNode(vnode) {
    const { type, props } = vnode;
    const node = document.createElement(type)
    updateNode(node, props)
    return node
}

//初次渲染，更新都会执行
/**
 * 实现新增插入fiber结构
 * */
function reconcileChildren(wip, children) {
    //children有不同类型，单个节点的时候就不是数组格式了，单个字符就是字符形式，源码是单个类型单个处理，此处统一转为数组处理
    if (isStr(children)) return;
    const newChildren = isArray(children) ? children : [children];
    let previousNewFiber = null
    for (const newChild of newChildren) {
        const newFiber = isStr(newChild)?createFiber({
            props: {children: newChild+''}
        },wip):createFiber(newChild, wip)
        /**
         * 为什么要判断previousNewFiber而不判断是否为第一个元素
         * 因为 react中遇到节点为null的情况是不允许返回的
         * 如果直接判断是否为第一个元素挂载到child上,碰到null节点就会有问题
         * */
        if (previousNewFiber === null) {
            //第0个fiber=>是wip的child
            wip.child = newFiber
        } else {
            //不是第一个子节点需要链接在上一个节点的sibling上
            previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
    }

}