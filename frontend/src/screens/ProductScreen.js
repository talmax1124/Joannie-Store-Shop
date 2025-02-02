import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import {
  listProductDetails,
  createProductReview,
  deleteProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
// import { HeartOutlined } from "@ant-design/icons/HeartOutlined";
import { deleteProduct } from "../actions/productActions";

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  const productReviewDelete = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReviewDelete,
    loading: loadingProductReviewDelete,
    error: errorProductReviewDelete,
  } = productReviewDelete;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
    }

    if (!product._id || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id));
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
  }, [dispatch, match, successProductReview, product]);

  useEffect(() => {
    if (successProductReviewDelete) {
      setRating(0);
      setComment("");
    }
  }, [successProductReviewDelete]);

  // useEffect(() => {
  //   if (successProductReviewDelete) {
  //     setRating("");
  //     setComment("");
  //   }

  //   if (!product._id || product._id !== match.params.id) {
  //     dispatch(listProductDetails(match.params.id));
  //     dispatch({ type: PRODUCT_DELETE_REVIEW_RESET });
  //   }
  // }, [dispatch, match, successProductReviewDelete, product]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
    LoadOnce();
  };

  const deleteReviewHandler = (reviewId) => (e) => {
    e.preventDefault();
    dispatch(
      deleteProductReview(match.params.id, {
        rating,
        comment,
        reviewId,
      })
    );
    LoadOnce();
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      dispatch(deleteProduct(id));
      goBackToHomeAfterDelete();
    }
  };

  // This is a function that makes the deletehandler reload the page once on the homescreen
  function goBackToHomeAfterDelete() {
    history.push("/");
    LoadOnce();
    alert("Product Has Been Deleted.");
  }

  // Line Below Reloads Page
  function LoadOnce() {
    window.location.reload();
  }

  return (
    <>
      <Link className="btn btn-dark my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Brand: {product.brand}</ListGroup.Item>
                <ListGroup.Item>Price: $ {product.price}</ListGroup.Item>

                {product.specialPrice > 0 && (
                  <>
                    <ListGroup.Item>
                      Discounted Price: $ {product.specialPrice}
                    </ListGroup.Item>
                  </>
                )}
                <ListGroup.Item>Category: {product.category}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  {/* <ListGroup.Item>
                    <p>Add to wishlist:</p>
                  </ListGroup.Item> */}
                  {product.price > 0 && (
                    <>
                      <ListGroup.Item>
                        <Row>
                          <Col>Price:</Col>
                          <Col>${product.price}</Col>
                        </Row>
                      </ListGroup.Item>
                    </>
                  )}

                  {product.specialPrice > 0 && (
                    <>
                      <ListGroup.Item>
                        <Col>Discounted Price:</Col>{" "}
                        <Col>$ {product.specialPrice}</Col>
                      </ListGroup.Item>
                    </>
                  )}
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>

                  {userInfo && userInfo.isAdmin && (
                    <ListGroup.Item>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <Button className="btn-block">
                          Edit Product: {product.name}
                        </Button>
                      </Link>
                    </ListGroup.Item>
                  )}

                  {userInfo && userInfo.isAdmin && (
                    <ListGroup.Item>
                      <Button
                        variant="danger"
                        className="btn btn-block"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <i className="fas fa-trash"></i> Delete Product:{" "}
                        {product.name}
                      </Button>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                    {userInfo.isAdmin && (
                      <Button
                        className="btn btn-danger btn-block"
                        onClick={deleteReviewHandler(review._id)}
                      >
                        Delete Comment
                      </Button>
                    )}
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {successProductReview && (
                    <Message variant="success">
                      Review submitted successfully
                    </Message>
                  )}

                  {loadingProductReview && <Loader />}
                  {loadingProductReviewDelete && <Loader />}
                  {errorProductReview && (
                    <>
                      <Message variant="danger">{errorProductReview}</Message>
                      <Message variant="danger">
                        {errorProductReviewDelete}
                      </Message>
                    </>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">⭐️ - Poor</option>
                          <option value="2">⭐️⭐️ - Fair</option>
                          <option value="3">⭐️⭐️⭐️ - Good</option>
                          <option value="4">⭐️⭐️⭐️⭐️ - Very Good</option>
                          <option value="5">⭐️⭐️⭐️⭐️⭐️ - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review{" "}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
