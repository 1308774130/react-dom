import { isFn, isStr } from "./utils";
import {updateHostComponent,updateFunctionComponent} from './ReactFiberReconcile'

//wip=>work in progress;当前正在工作的任务
let wipRoot = null;
let nextUnitofWork = null; //链表，用于存放待更新任务

/**
 * 1.更新当前任务
 * 2.返回下一个任务
 */
function performUnitOfWork(wip) {
    const {type} = wip;
    if(isStr(type)){
        //原生标签
        updateHostComponent(wip)
    }else if(isFn(type)){
        //函数组件,类组件
        updateFunctionComponent(wip)
    }
    //更新下一个任务是参照深度遍历
    if (wip.child) {
        return wip.child
    }
    let next = wip;
    while(next){
        if(next.sibling){
            return next.sibling
        }
        next = next.return
    }
}
function workLoop(IdleDeadline) {
    //IdleDeadline.timeRemaining获取当前浏览器剩余空闲时间
    while (nextUnitofWork && IdleDeadline.timeRemaining() > 0) {
        //nextUnitofWork中有未完成任务并且浏览器有剩余空闲时间则继续更新任务链表,完成后并返回下一个任务
        nextUnitofWork = performUnitOfWork(nextUnitofWork)
    }

    //执行完了待运行任务 就提交
    if(!nextUnitofWork && wipRoot){
        commitRoot()
    }
}

//window.requestIdlecallback()是浏览器api，reactFiber没有直接使用这个浏览器api，因为浏览器函数总会有兼容问题和不可控因素，但是reactfiber是基于这个原理实现的
requestIdleCallback(workLoop)

export function scheduleUpdateOnFiber(fiber){
    wipRoot = fiber;
    wipRoot.sibling = null;
    nextUnitofWork = wipRoot
}

/**处理更新 vnode->node 挂载到节点*/
function commitRoot(){
    commitWorker(wipRoot.child);//剔除div#root
}
/**
 * 1.更新自己
 * 2.更新子节点
 * 3.更新兄弟
 */
function commitWorker(wip){
    if(!wip) return;
    const {stateNode} = wip;
    let parentNode = getParentNode(wip.return)
    if(stateNode) parentNode.appendChild(stateNode)

    commitWorker(wip.child);commitWorker(wip.sibling);
}

/**
 * 寻找父dom节点
 * fiber不一定有dom节点,(函数组件,类组件..)
 * 本身没有dom节点的就找父节点,父节点也是组件就再往上找,直到找到dom节点
 */
function getParentNode(wip){
    let tmp = wip
    while(tmp){
        if(tmp.stateNode) return tmp.stateNode
        tmp = tmp.return
    }
}