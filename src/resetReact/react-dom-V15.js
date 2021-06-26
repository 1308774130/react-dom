import { isStr, isArray, isStringOrNumber } from './utils'
/**
 * 主入口
 * 1.vnode->node
 * 2.把node挂载在container上
 */
function render(vnode, container) {
    const node = createNode(vnode)
    container.appendChild(node)
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
    reconcileChildren(node, props.children)
    return node
}
/**
 * 更新子节点，把属性挂载在节点上
 * 
 */
function updateNode(node, tags) {
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