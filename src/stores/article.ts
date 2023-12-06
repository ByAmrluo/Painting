import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { reqArticle, reqArticlePage } from "@/api/acticle/index.ts";
import { reqArticleNewPage } from "@/api/acticle";
export const useArticleStore = defineStore('Article', () => {
    // 存储文章列表
    let Articles = ref([])
    let ArticleAll = ref([])
    // 存储当前文章列表
    let articleCurrent = ref<any>(null)
    let total = ref(1)
    let catagoryArt = ref([])
    // 获取所有文章列表
    const getAllArticle = async () => {
        let res = await reqArticle()
        if (res.code == 200) {
            ArticleAll.value = res.data
            return 'ok'
        } else {
            return Promise.reject(new Error('失败！'))
        }
    }
    const getPageArticle = async (pageNum = 1, pageSize = 10) => {
        if (Articles.value.length >= total.value) {
            return
        }
        let res = await reqArticlePage(pageNum, pageSize)
        if (res.code == 200) {
            console.log(res.data);
            total.value = res.data.total
            Articles.value = [...Articles.value, ...res.data.records]
            return 'ok'
        } else {
            return Promise.reject(new Error('失败！'))
        }
    }
    const getNewPage = async (pageNum = 1, pageSize = 10) => {

        if (catagoryArt.value.length >= total.value) {
            if (Articles.value.length == 0) {
                Articles.value = [...Articles.value, ...catagoryArt.value]
            }
            return
        }
        let res = await reqArticleNewPage(pageNum, pageSize)
        if (res.code == 200) {
            console.log(res.data);
            total.value = res.data.total
            Articles.value = [...Articles.value, ...res.data.records]
            catagoryArt.value = [...catagoryArt.value, ...res.data.records]
            return 'ok'
        } else {
            return Promise.reject(new Error('失败！'))
        }
    }
    return {
        Articles,
        getAllArticle,
        getPageArticle,
        articleCurrent,
        total,
        getNewPage,
        ArticleAll,
        catagoryArt
    }

})