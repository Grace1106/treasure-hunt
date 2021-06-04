import React, { useEffect, useState } from 'react';
import { Card, Col, Layout, List, Row, Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { PICTURE_URL_PREFIX } from 'constants/constants';
import './SavedListings.style.css';
import { useLogin, useFetchSavedListings } from 'hooks';

const { Header, Content } = Layout;
const { Meta } = Card;

const SavedListings = () => {
  // listings stores listings data stored in db
  const [savedListings, setSavedListings] = useState([]);
  const { isLoggingIn, login } = useLogin(); // For testing purposes, TODO remove
  const { isFetching, fetchSavedListings } = useFetchSavedListings();

  const fetch = async () => {
    const { listings, error } = await fetchSavedListings();
    if (error !== undefined) {
      if (error === 401) {
        await login({ username: 'lichengrao7', password: 12345678 });
      }
      message.error(
        error === 401 ? 'Invalid token' : 'Failed to get saved listings'
      );
    } else {
      setSavedListings(listings);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const getPictureUrl = (picture_urls) => {
    return `${PICTURE_URL_PREFIX}${Object.values(picture_urls)[0]}`;
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div className="saved-listings-page">
      <Layout>
        <Header>Header</Header>
        <Content className="saved-listings-content">
          {isFetching ? (
            <Spin
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              indicator={antIcon}
            />
          ) : (
            <List
              grid={{
                gutter: 48,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 4,
                xxl: 5,
              }}
              dataSource={savedListings}
              renderItem={(item) => (
                <List.Item key={item.listing_id}>
                  <Card
                    hoverable
                    style={{ width: '100%' }}
                    cover={
                      <img alt="pic" src={getPictureUrl(item.picture_urls)} />
                    }
                  >
                    <Meta title={item.title} className="listing-info" />
                    <Row gutter={[16, 24]} className="listing-info">
                      <Col>{item.description}</Col>
                    </Row>
                    <Row
                      gutter={[16, 24]}
                      justify="space-between"
                      className="listing-info"
                    >
                      <Col>{'$' + item.price}</Col>
                      <Col>{item.location}</Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Content>
      </Layout>
    </div>
  );
};

export default SavedListings;