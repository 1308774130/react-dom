import { isStr, isArray, isStringOrNumber } from './utils'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'
/**
 * 主入口
 * 1.vnode->node
 * 2.把node挂载在container上
 */
function render(vnode, container) {
    //建立一个根节点fiber
    const fiberRoot = {
        type: container.nodeName.toLocaleLowerCase(),
        stateNode: container,
        props: { children: vnode },
    }

    //从根节点开始更新
    scheduleUpdateOnFiber(fiberRoot)
}

/**
 * 更新子节点，把属性tags挂载在节点node上
 * 
 */
export function updateNode(node, tags) {
    for (let tagName of Object.keys(tags)) {
        if (tagName === 'children') {
            //子节点是纯TXT
            if (isStringOrNumber(tags[tagName])) node.textContent = tags[tagName] + "";
            //子节点是数组类型（多个子节点）
            else if (isArray(tags[tagName])) {
                for (let child of tags[tagName]) {
                    if (isStringOrNumber(child)) node.textContent = child + "";
                }
            }
        } else if (tagName.slice(0, 2) === "on") {
        } else {
            node[tagName] = tags[tagName]
        }
    }
}
/**
 * 循环子节点 
 * 1.把childNode取出来
 * 2.childvode->node
 * 3.挂载在parentNode
 */
function reconcileChildren(parentNode, childVnode) {
    if (isStringOrNumber(childVnode)) return
    for (let child of childVnode) {
        if (!isStringOrNumber(child))
            render(child, parentNode)
    }
}
export default { render }