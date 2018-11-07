<?php

class projectfactoryViewHelper extends waAppViewHelper
{

    const SITE_PAGE_ID_INDEX = 69;

    /**
     * Get templates path
     *
     * @return string
     */
    public static function TemplatesPath()
    {
        return wa()->getAppPath('', 'projectfactory') . '/templates/actions/';
    }

    /**
     * Cache method
     *
     * @param $key
     * @param null $value
     * @param int $ttl
     * @return null|string
     */
    public static function Cache($key, $value = null, $ttl = 3600)
    {
        if (empty($value)) {
            if (wa()->getConfig()->isDebug()
                || waRequest::get('debug') !== null
                || strpos(waRequest::server('REQUEST_URI'), 'adminer') !== false
            ) {
                // if debug mode - return empty result
                return null;
            }
        }
        $res = '';
        $z = new waVarExportCache($key, $ttl, $app_id = 'projectfactory');
        if (empty($value)) {
            // get cache
            $res = $z->get();
        } else {
            // set cache
            $z->set($value);
        }

        return $res;
    }

    /**
     * Get page prices
     *
     * @return mixed
     */
    public function getPagePrices($str)
    {
        $a = array();
        preg_match_all('{(<table.*?class="tprices.*?".*>.*</table>)}usi', $str, $a);

        return @$a[0];
    }

    /**
     * Get prices
     *
     * @return mixed
     */
    public function getPrices()
    {
        $pages = wa()->getView()->getHelper()->site->pages(self::SITE_PAGE_ID_INDEX, false, 1, true);
        foreach ($pages as $k => $city) {
            foreach ($city['childs'] as $k2 => $service) {
                $prices = $this->getPagePrices($service['content']);
                $pages[$k]['childs'][$k2]['prices'] = $prices;
                if (count($prices)) {
                    $pages[$k]['pricesExist'] = 1;
                }
            }
        }

        return $pages;
    }

    /**
     * Get shares
     *
     * @return array
     */
    public function getShares()
    {
        $arr = array();
        $MBlogPost = new blogPostModel();
        foreach (blogCategory::getAll() as $category) {
            $posts = $MBlogPost->where("
                id IN (
                    SELECT post_id
                    FROM blog_post_category
                    WHERE category_id = $category[id]
                )
                AND status = 'published'
            ")->order('datetime DESC, id DESC')->fetchAll();
            foreach ($posts as &$p) {
                $p['link'] = blogPost::getUrl($p);
            }
            $category['childs'] = $posts;
            $arr[] = $category;
        }

        return $arr;
    }

    /**
     * Get medcenter by general service
     *
     * @param $medcenterID
     * @param $serviceGeneralID
     * @return null|string
     */
    public function getMedcenterServiceByGeneralServiceID($medcenterID, $serviceGeneralID)
    {
        $arr = array();
        $MPages = new sitePageModel();
        $serviceGeneral = wa()->getView()->getHelper()->site->page($serviceGeneralID);
        $medcenter = wa()->getView()->getHelper()->site->page($medcenterID);

        $res = $MPages->query("
            SELECT id
            FROM site_page
            WHERE full_url = '$medcenter[full_url]$serviceGeneral[full_url]'
            AND status > 0
            LIMIT 1
        ")->fetch();

        if (!$res) {
            return $arr;
        }

        $arr = wa()->getView()->getHelper()->site->page($res['id'], true);

        return $arr;
    }

}