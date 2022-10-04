import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import MainWrapper from './MainWrapper';
import LazyLoading from '../components/LazyLoading/LazyLoading';
// import LandingPage from './LandingPage/LandingPage';
import MainApp from './MainApp/MainApp';
import Protected from '../components/Protected/Protected';
import RequestNoticeView from './LegalNotices/RequestNoticeView';
import NoticeDetailView from './LegalNotices/NoticeDetailView';
import Dashboard from './Dashboard';
import CaseCreatePage from './CaseManagement/CaseCreatePage';
import CaseDetailsPage from './CaseManagement/CaseDetailsPage';
import CaseListingPage from './CaseManagement/CaseListingPage';
import Tasks from './Tasks';
import AgreementsListingPage from './AgreementsManager/AgreementsListingPage';
import AgreementCreatePage from './AgreementsManager/AgreementCreatePage';
import CaseFormNew from './CaseFormNew';
import DashboardNew from './DashboardNew';
import NotificationsPage from './NotificationsPage';
import NoticeRequest from './NoticeRequest/NoticeRequest';
import NoticesListing from './LegalNotices/NoticesListing';
import NoticeCreatePage from './LegalNotices/NoticeCreation/NoticeCreatePage';
import NoticeDetailsPage from './LegalNotices/NoticeDetailsPage';
import TemplatesList from '../components/TemplateManager/TemplatesList';
import TemplateForm from '../components/TemplateManager/TemplateForm';
import NewLandingPageRedirect from './NewLandingPageRedirect';
import LandingPage from './LandingPage/LandingPage';
import ServiceProviderList from './ServiceProvider/ServiceProviderList';
import BudgetManager from './BudgetManager/BudgetManager';
import LoginPage from './LoginPage';
// import ServiceProviderDetail from '../components/ServiceProviderDetail/ServiceProviderDetail';
import ServiceProviderDetails from './ServiceProvider/ServiceProviderDetails';
// import AgreementDetailsPage from './AgreementsManager/AgreementDetailsPage';
const AgreementDetailsPage = lazy(() => import('./AgreementsManager/AgreementDetailsPage'));

const RouteHandler = () => (
  <MainWrapper>
    <Suspense fallback={<LazyLoading />}>
      <Routes>
        <Route path="/" exact element={process.env.REACT_APP_ENV === 'LOCALHOST' ? <LandingPage /> : <NewLandingPageRedirect />} />
        <Route
          path="/app/login/"
          exact
          element={<LoginPage />}
        />
        <Route path="/request-notice" exact element={<NoticeRequest />} />
        <Route
          path="/app/case-new-form"
          exact
          element={(
            <Protected>
              <MainApp appContent={<CaseFormNew />} />
            </Protected>
)}
        />
        <Route
          path="/app-old"
          exact
          element={<Protected><MainApp appContent={<Dashboard />} /></Protected>}
        />
        <Route
          path="/app"
          exact
          element={<Protected><MainApp appContent={<DashboardNew />} /></Protected>}
        />
        <Route
          path="/app/notifications"
          exact
          element={<Protected><MainApp appContent={<NotificationsPage />} /></Protected>}
        />
        <Route
          path="/app/tasks"
          exact
          element={<Protected><MainApp appContent={<Tasks />} /></Protected>}
        />
        <Route
          path="/app/dispute-manager/edit-case"
          exact
          element={<Protected><MainApp appContent={<CaseCreatePage />} /></Protected>}
        />
        <Route
          path="/app/dispute-manager/cases"
          exact
          element={<Protected><MainApp appContent={<CaseListingPage />} /></Protected>}
        />
        <Route
          path="/app/dispute-manager/cases/details/:caseId"
          exact
          element={<Protected><MainApp appContent={<CaseDetailsPage />} /></Protected>}
        />

        <Route
          path="/app/dispute-manager/legal-notices/create"
          exact
          element={<Protected><MainApp appContent={<NoticeCreatePage />} /></Protected>}
        />
        <Route
          path="/app/dispute-manager/legal-notices/edit/"
          exact
          element={<Protected><MainApp appContent={<NoticeCreatePage />} /></Protected>}
        />
        <Route
          path="/app/dispute-manager/legal-notices"
          exact
          element={<Protected><MainApp appContent={<NoticesListing />} /></Protected>}
        />
        <Route
          path="/app/dispute-manager/legal-notices/details/:noticeId"
          exact
          element={<Protected><MainApp appContent={<NoticeDetailsPage />} /></Protected>}
        />
        <Route
          path="/app/view/notice-request/:noticeRequestRef"
          exact
          element={(
            <Protected>
              <MainApp appContent={<RequestNoticeView />} />
            </Protected>
                        )}
        />
        <Route
          path="/app/view/notice/:noticeRef"
          exact
          element={(
            <Protected>
              <MainApp appContent={<NoticeDetailView />} />
            </Protected>
              )}
        />
        <Route
          path="/app/templates"
          exact
          element={<Protected><MainApp appContent={<TemplatesList />} /></Protected>}
        />
        <Route
          path="/app/templates/new"
          exact
          element={<Protected><MainApp appContent={<TemplateForm />} /></Protected>}
        />
        <Route
          path="/app/agreements"
          exact
          element={<Protected><MainApp appContent={<AgreementsListingPage />} /></Protected>}
        />
        <Route
          path="/app/agreements/details/:agreementId"
          exact
          element={(
            <Protected>
              <MainApp appContent={(
                <Suspense fallback={<BeatLoader />}>
                  <AgreementDetailsPage />
                </Suspense>
          )}
              />
            </Protected>
)}
        />
        <Route
          path="/app/agreements/new"
          exact
          element={<Protected><MainApp appContent={<AgreementCreatePage />} /></Protected>}
        />
        <Route
          path="/app/agreements/edit/"
          exact
          element={<Protected><MainApp appContent={<AgreementCreatePage />} /></Protected>}
        />
        <Route
          path="/app/service-providers/"
          exact
          element={<Protected><MainApp appContent={<ServiceProviderList />} /></Protected>}
        />
        <Route
          path="/app/service-providers/details/:serviceProviderId"
          exact
          element={<Protected><MainApp appContent={<ServiceProviderDetails />} /></Protected>}
        />
        <Route
          path="/app/budget-manager/"
          exact
          element={<Protected><MainApp appContent={<BudgetManager />} /></Protected>}
        />
      </Routes>
    </Suspense>
  </MainWrapper>
);
export default RouteHandler;
