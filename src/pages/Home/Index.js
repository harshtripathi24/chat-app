import React from 'react';
import { Switch , Route, useRouteMatch } from 'react-router';
import { Grid, Row, Col } from 'rsuite';
import Sidebar from '../../components/Sidebar';
import { RoomProvider } from '../../context/rooms.context';
import { useMediaQuery } from '../../misc/Custom-Hooks';
import Chat from './Chat';

// eslint-disable-next-line arrow-body-style
const Home = () => {

  const isDesktop = useMediaQuery(`(min-width: 990px)`);

  const {isExact } = useRouteMatch();

  const canRederSidebar = isDesktop || isExact  ;

  
  return (
    <RoomProvider>
      <Grid fluid className="h-100">
        <Row className="h-100">
      {canRederSidebar && 
      
          <Col xs={24} md={8} className="h-100">
            <Sidebar />
          </Col>
      
      }


          <Switch>
            <Route exact path="/chat/:chatId" >
              <Col xs={24} md={16} className='h-100'  >
              <Chat/>
              </Col>
            </Route>
            <Route>
             
             {isDesktop && <Col xs={24} md={16} className='h-100'  >
             
              <h4 className='text-center mt-page ' >Please Select chat </h4>
             </Col> }

            </Route>
          </Switch>

        </Row>
      </Grid>
    </RoomProvider>
  );
};

export default Home;
