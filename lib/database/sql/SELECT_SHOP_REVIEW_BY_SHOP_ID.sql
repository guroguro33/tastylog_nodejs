SELECT
  t_review.id,
  t_user.id as `user_id`,
  t_user.name as `user_name`,
  t_review.score,
  t_review.visit,
  t_review.post,
  t_review.description
FROM
  t_review
  LEFT JOIN
    t_user 
    ON t_user.id = t_review.user_id
WHERE
  t_review.shop_id = ?