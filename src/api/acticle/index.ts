//配置登录请求
import request from "@/util/request";
enum API {
    ARTICLE_URL = '/article/list',
    PAGELIST_URL = '/article/page',
    CATEGORY_URL = '/category/list',
    AddARTICLE_ULR = '/article',
    GETARTICLEIMGS_URL = '/article/articleImgs/',
    SETCOLLECT_URL = '/static/collect/',
    GETALLCOLLECT_URL = '/static',
    GETARTICLEUSER_URL = '/article/getArticle',
    GETDESIGNER_URL = '/static/userStatic',
    GETUSER_URL = '/static/myStatic/',
    ADDCOMMENT = '/comment/add',
    GETCOMMENTLIST = '/comment/tree/',
    DELETECOMMENT = '/comment/delete/',
    NEWPAGELIST_URL = '/article/new/page',
    POSTHIT_URL = '/static/hit/',
    PUBLISHREQ_URL = '/reserve',
    DRAW_URL = '/reserve/draw',
    DESIGN_URL = '/reserve/design',
    DESIGNERORDER_URL = '/reserve/designOrder',
    ORDERPAGE_URL = '/reserve/page',
    GETALLPAGE_URL = '/reserve/allPage',
    UPDATAE_URL = '/reserve/design'
}
// 获取所有文章列表
export const reqArticle = () => { return request.get(API.ARTICLE_URL) }
// 获取文章分页信息
export const reqArticlePage = (pageNum: number, pageSize: number, search: string) => {

    if (search) {
        return request.get(API.PAGELIST_URL + '?' + `pageNum=${pageNum}&pageSize=${pageSize}&` + `title=${search}`)
    } else {
        return request.get(API.PAGELIST_URL + '?' + `pageNum=${pageNum}&pageSize=${pageSize}`)
    }

}
// 降序获取文章
export const reqArticleNewPage = (pageNum: number, pageSize: number) => { return request.get(API.NEWPAGELIST_URL + '?' + `pageNum=${pageNum}&pageSize=${pageSize}`) }
// 获取文章分类信息
export const reqArticleCategory = () => { return request.get(API.CATEGORY_URL) }
// 添加文章
export const reqArticleAdd = (articleParams: any) => { return request.post(API.AddARTICLE_ULR, articleParams) }
// 获取文章图片信息
export const reqArticleImgs = (id: number) => { return request.get(API.GETARTICLEIMGS_URL + id) }
// 收藏谋篇作品
export const reqCollectArticle = (articleId: number, flag: boolean) => { return request.post(API.SETCOLLECT_URL + '?' + `articleId=${articleId}&flag=${flag}`) }
// 获取当前登录用户的收藏列表
export const reqCollectAllList = () => { return request.get(API.GETALLCOLLECT_URL) }
// 获取对应用户的作品列表
export const reqArticleUserArticle = () => { return request.get(API.GETARTICLEUSER_URL) }
// 获取所有用户的粉丝数量与收藏

export const reqDesignerList = (page: number, limit: number, username) => { return request.get(API.GETDESIGNER_URL + '?' + 'pageNum=' + page + '&' + `pageSize=${limit}`) }
// 获取对应用户的点赞收藏量
export const reqUserStatic = (userId: number) => { return request.get(API.GETUSER_URL + userId) }
// 新增评论
export const reqAddComment = (commentForm: any) => { return request.post(API.ADDCOMMENT, commentForm) }
// 获取对应文章的评论
export const reqAllComment = (articleId: number) => { return request.get(API.GETCOMMENTLIST + articleId) }
// 删除评论
export const reqCommentDel = (deleteId: number) => { return request.delete(API.DELETECOMMENT + deleteId) }
// 点赞某个作品
export const reqAddHit = (articleId: number, flag: boolean) => { return request.post(API.POSTHIT_URL + '?' + `articleId=${articleId}&flag=${flag}`) }
// 发布请求
export const reqAddReserve = (data) => { return request.post(API.PUBLISHREQ_URL, data) }
// 获取自己的预约（客户）数据
export const reqReserveList = () => { return request.get(API.PUBLISHREQ_URL) }
// 设计师接受订单
export const reqDrawOrder = (orderId: number) => { return request.post(API.DRAW_URL + '?' + `orderId=${orderId}`) }
// 设计师上传图片
export const reqUploadOrder = (data) => { return request.put(API.DESIGN_URL, data) }
// 设计师获取已接受的订单
export const reqDesOrderList = () => { return request.get(API.DESIGNERORDER_URL) }
// 获取所有已发布的请求
export const reqReservePage = (pageNum: number, pageSize: number, search: string) => {

    if (search) {
        return request.get(API.ORDERPAGE_URL + '?' + `pageNum=${pageNum}&pageSize=${pageSize}&` + `title=${search}`)
    } else {
        return request.get(API.ORDERPAGE_URL + '?' + `pageNum=${pageNum}&pageSize=${pageSize}`)
    }

}
// 获取所有的订单（后台）
export const reqOrderPage = (pageNum: number, pageSize: number, search: string) => {

    if (search) {
        return request.get(API.GETALLPAGE_URL + '?' + `pageNum=${pageNum}&pageSize=${pageSize}&` + `title=${search}`)
    } else {
        return request.get(API.GETALLPAGE_URL + '?' + `pageNum=${pageNum}&pageSize=${pageSize}`)
    }

}
// 上传订单图片
export const reqUplaodOrderImg = (data) => { return request.put(API.UPDATAE_URL, data) }