import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ConfigProvider } from "zarm";
import zhCN from "zarm/lib/config-provider/locale/zh_CN";
import routes from "../router";

const App = () => {
  return (
    <Router>
      <ConfigProvider primaryColor="#007fff" locale={zhCN}>
        <Switch>
          {routes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              <route.component />
            </Route>
          ))}
        </Switch>
      </ConfigProvider>
    </Router>
  );
};

export default App;
