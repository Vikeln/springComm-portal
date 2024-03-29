/* global $ */

import React, { Component } from 'react';
import {
    Link
} from "react-router-dom";


import { faHandHoldingUsd, faHourglass, faDrawPolygon, faMobileAlt, faEnvelope, faTimesCircle, faCalculator, faBullseye, faEye, faPen, faToggleOff, faLockOpen, faToggleOn } from '@fortawesome/free-solid-svg-icons';

import SummaryIcon from '../../components/Admin/SummaryIcon';
import Chart from '../../components/Admin/Chart';


import CommunicationsService from '../../services/communications.service';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

//import Loader from '../../components/loaders/Loader';

import Badge from '../../components/notifications/Badge';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, Modal } from 'react-bootstrap'
import Loader from '../../components/loaders/Loader';


import utils from '../../utils/utils';
import tenantService from '../../services/tenant.service';
import sourceService from '../../services/source.service';
import { clientBaseUrl } from '../../API';
import userService from '../../services/user.service';


export default class SingleClient extends Component {

    constructor(props) {

        super(props);

        this.state = {
            smsBalance: undefined,
            sentSms: undefined,
            scheduledSms: undefined,
            sentScheduledSms: undefined,
            chartdata: "",
            clientService: { unitCosts: "" },
            customerId: this.props.match.params.id,
            completeData: { ivm: "" },
            client: {
                country: {}
            },
            standingFormData: {
                clientService: "",
                charge: ""
            },
            sources: [],
            startdate: "",
            inv: "",
            enddate: "",
            codes: [],
            usageReport: {
                clientService: "",
                standingCharge: "",
                serviceUsageCharge: "",
                total: "",
                summaryItemModels: "",
            },
            documents: [],
            users: [],
            services: [],
            loading: false,
            loadingService: false,
            showUsageModal: false,
            serviceId: undefined,
            showCosts: false,
            showStandingCharges: false,
            billingTransactions: [],
            formData: [],

        }

        this.toggleTab = this.toggleTab.bind(this);
        this.getData = this.getData.bind(this);
        this.loadSingleCustomer = this.loadSingleService.bind(this);
        this.getClientSources = this.getClientSources.bind(this);
        this.openRepaymentModalWithItem = this.openRepaymentModalWithItem.bind(this);
        this.handleshowHideRepaymentModal = this.handleshowHideRepaymentModal.bind(this);
        this.openStandingModalWithItem = this.openStandingModalWithItem.bind(this);
        this.handleshowHideStandingModal = this.handleshowHideStandingModal.bind(this);
        this.handleChanges = this.handleChanges.bind(this);
        this.updateStartDate = this.updateStartDate.bind(this);
        this.updateEndDate = this.updateEndDate.bind(this);
        this.openUsageModalWithItem = this.openUsageModalWithItem.bind(this);
        this.handleshowHideUsageModal = this.handleshowHideUsageModal.bind(this);
        this.handleStandingSubmission = this.handleStandingSubmission.bind(this);
        this.getClientServiceUsageReport = this.getClientServiceUsageReport.bind(this);

        this.enableUser = this.enableUser.bind(this);

        this.unlockUserAccount = this.unlockUserAccount.bind(this);

        this.deactivateUser = this.deactivateUser.bind(this);
        this.openCompleteModalWithItem = this.openCompleteModalWithItem.bind(this);
        this.handleshowHideCompleteModal = this.handleshowHideCompleteModal.bind(this);
        this.handleComletePaymentSubmission = this.handleComletePaymentSubmission.bind(this);
        this.handleCompleteChange = this.handleCompleteChange.bind(this);

    }

    async componentDidMount() {
        $("body").on("click", ".enableUser", this.enableUser);
        $("body").on("click", ".completePayment", this.openCompleteModalWithItem);
        $("body").on("click", ".disableUser", this.deactivateUser);
        $("body").on("click", ".unlockUser", this.unlockUserAccount);

        const { id } = this.props.match.params;


        await this.loadSingleService(id);
        await this.loadClientServices(id);
        await this.fetchUsers(id);

        $(document).on("click", ".tab-nav li", this.toggleTab);

        $(document).on("click", ".openCostsModal", this.openRepaymentModalWithItem);
        $(document).on("click", ".updateStandingChargeModal", this.openStandingModalWithItem);
        $(document).on("click", ".usageModal", this.openUsageModalWithItem);


        $(".tab-pane").each(function (index, value) {
            $(this).find(".tab-content").hide();
            $(this).find(".tab-content:first").show();
        });

        $(".tab-nav").each(function (index, value) {

            $(this).find("li").removeClass("active");
            $(this).find("li:first").addClass("active");

        });
        $(".startdate").datepicker({
            format: 'yyyy/mm/dd',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            endDate: '0d',
            datesDisabled: '+1d',
        })

        $(".enddate").datepicker({
            format: 'yyyy/mm/dd',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            endDate: '0d',
            datesDisabled: '+1d',
        });

        $(document).on("change", ".startdate", this.updateStartDate);
        $(document).on("change", ".enddate", this.updateEndDate);
        $("body").on("click", ".commissionSource", this.enableSource);
        $("body").on("click", ".decommissionSource", this.disableUser);

    }

    updateStartDate(date) {



        this.setState({
            startdate: date.target.value
        });

    }

    updateEndDate(date) {



        this.setState({
            enddate: date.target.value
        });

    }

    componentDidUpdate() {

        $(".table").each(function (index, value) {
            $(this).bootstrapTable('refresh');
        });

        $(".tab-pane").each(function (index, value) {
            $(this).find(".tab-content").hide();
            $(this).find(".tab-content:first").show();
        });

        $(".tab-nav").each(function (index, value) {

            $(this).find("li").removeClass("active");
            $(this).find("li:first").addClass("active");

        });

        $(".createInteraction").parsley();

        $(".interactiondate").datepicker({
            format: 'dd/mm/yyyy',
            todayHighlight: true,
            autoclose: true,
            startDate: '0d',
            datesDisabled: '-1d',
            orientation: 'bottom'
        });

        $(".startdate").datepicker({
            format: 'yyyy/mm/dd',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            endDate: '0d',
            datesDisabled: '+1d',
        })

        $(".enddate").datepicker({
            format: 'yyyy/mm/dd',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            endDate: '0d',
            datesDisabled: '+1d',
        });

    }
    openAdvancedSearch() {

        $(".advancedSearch").stop().slideToggle();

    }


    openCompleteModalWithItem(el) {
        el.preventDefault();
        var interactionId = el.target.dataset.id;

        let stateCopy = Object.assign({}, this.state);
        stateCopy.completeData.ivm = interactionId;

        this.setState(stateCopy);
        this.handleshowHideCompleteModal();

    }

    handleshowHideCompleteModal() {
        this.setState({
            showcomplete: !this.state.showcomplete
        });
    }

    handleComletePaymentSubmission(el) {
        el.preventDefault();

        const { completeData } = this.state;

        this.setState({
            loading: true,
        });

        this.handleshowHideCompleteModal();
        // if ($(".createSource").parsley().isValid()) {
        tenantService.completeClientTransaction(completeData).then(response => {

            if (response.data.successStatus != "error") {
                confirmAlert({
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'OK',
                            onClick: () => window.location.reload()
                        }
                    ]
                });

            } else {
                confirmAlert({
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'Ok',
                        }
                    ]
                });
            }

        }).catch(error => {
            confirmAlert({
                message: error.message,
                buttons: [
                    {
                        label: 'Ok',
                    }
                ]
            });
        });

        this.setState({
            loading: false,
        });
    }

    openRepaymentModalWithItem(el) {
        el.preventDefault();
        var interactionId = el.target.dataset.id;
        this.setState({
            serviceId: interactionId,
        });
        this.handleshowHideRepaymentModal();
        this.loadSingleClientService(interactionId);
    }

    openStandingModalWithItem(el) {
        el.preventDefault();
        var interactionId = el.target.dataset.id;
        var charge = el.target.dataset.charge;
        this.setState({
            charge: charge,
        });
        this.handleshowHideStandingModal();
        this.loadSingleClientService(interactionId);
    }

    openUsageModalWithItem(el) {
        el.preventDefault();
        var serviceId = el.target.dataset.id;
        this.setState({
            serviceId: serviceId,
            usageReport: {
                clientService: "",
                standingCharge: "",
                serviceUsageCharge: "",
                total: "",
                summaryItemModels: "",
            },
        });
        this.handleshowHideUsageModal();
    }

    loadSingleClientService(serviceId) {
        this.setState({ loadingService: true });
        tenantService.getClientService(serviceId).then(response => {

            if (response.data.status != "error") {
                this.setState({
                    clientService: response.data.data,
                    formData: response.data.data.unitCosts,
                    loadingService: false
                });
            } else {

                this.setState({ loadingService: false });
                confirmAlert({
                    title: 'Error fetching service',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });
            }


        }).catch(error => {
            this.setState({ loadingService: false });
            confirmAlert({
                title: 'Error occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });
        });

    }

    handleshowHideRepaymentModal() {
        this.setState({ showCosts: !this.state.showCosts })
    }

    handleshowHideUsageModal() {
        this.setState({ showUsageModal: !this.state.showUsageModal })
    }

    handleshowHideStandingModal() {
        this.setState({ showStandingCharges: !this.state.showStandingCharges })
    }


    toggleTab(event) {

        var taget = event.target.dataset.target;
        var listItem = event.target;

        $(listItem).parents(".tab-nav").find("li").removeClass("active");
        $(listItem).addClass("active");
        $(listItem).parents(".tab-nav").next().find(".tab-content").hide();
        $(listItem).parents(".tab-nav").next().find(".tab-content." + taget).show();


        $(this).parents(".tab-nav").next().find("").addClass("targeted");




        // $("this").parents(".tab-nav").next(".col-9").find(".tab-content."+event.target.dataset.target).addClass("targeted");

    }


    getData(clientKey) {

        CommunicationsService.getportalData(clientKey).then(response => {

            if (response.data.status != "error") {


                this.setState({
                    sentSms: response.data.data.sentSms,
                    scheduledSms: response.data.data.scheduledSms,
                    smsBalance: response.data.data.smsBalance,
                    sentScheduledSms: response.data.data.sentScheduledSms,
                    loading: false,
                });
            } else {

                confirmAlert({
                    title: 'Error occurred',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });

                this.setState({
                    loading: false,
                });

            }


        }).catch(error => {

            confirmAlert({
                title: 'Error occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });

            this.setState({
                loading: false,
            });

        });



        CommunicationsService.getportalGraphData(clientKey).then(response => {

            if (response.data.status != "error") {

                const data = {
                    labels: ['Today', 'This Week', 'This Month', 'This Year'],
                    datasets: [
                        {
                            label: 'SMS Usage',
                            backgroundColor: '#49bcd7',
                            borderColor: '#49bcd7',
                            borderWidth: 1,
                            hoverBackgroundColor: '#49bcd7',
                            hoverBorderColor: '#49bcd7',
                            data: [response.data.data.today, response.data.data.week, response.data.data.month, response.data.data.year]
                        }
                    ]
                };



                this.setState({
                    chartdata: data,
                    loading: false,
                });

            } else {

                confirmAlert({
                    title: 'Error occurred',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });

                this.setState({
                    loading: false,
                });

            }


        }).catch(error => {

            confirmAlert({
                title: 'Error occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });

            this.setState({
                loading: false,
            });

        });

        this.setState({
            loading: false,
        });

    }

    loadSingleService(customerId) {


        tenantService.getClient(customerId).then(response => {

            if (response.data.successMessage === "success") {

                this.setState({
                    client: response.data.data,
                    loading: false,
                });
                this.getData(response.data.data.tenantKey);
                this.getClientSources(response.data.data.tenantKey);


            } else {

                confirmAlert({
                    title: 'Error',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });

                this.setState({
                    loading: false,
                });

            }



        }).catch(error => {

            confirmAlert({
                title: 'Error',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });

            this.setState({
                loading: false,
            });

        });

    }

    getClientServiceUsageReport(el) {
        el.preventDefault();
        const { startdate, enddate, serviceId } = this.state;
        this.setState({
            loading: true,
        });
        tenantService.getClientServiceUsageReport(serviceId, startdate, enddate).then(response => {

            if (response.data.successMessage === "success") {

                this.setState({
                    usageReport: response.data.data,
                    loading: false,
                });


            } else {

                confirmAlert({
                    title: 'Error',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });

                this.setState({
                    loading: false,
                });

            }



        }).catch(error => {

            confirmAlert({
                title: 'Error',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });

            this.setState({
                loading: false,
            });

        });

    }

    getClientSources(clientKey) {
        sourceService.getAllSources(clientKey).then(response => {

            if (response.data.status != "error") {


                this.setState({
                    sources: response.data.data != null ? response.data.data : [],
                });


                $(".Sourcetable").bootstrapTable();
            } else {
                confirmAlert({
                    title: 'Error fetching your sources',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });
            }


        }).catch(error => {
            confirmAlert({
                title: 'Error occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });
        });

    }

    loadClientServices(clientId) {

        tenantService.getClientServices(clientId).then(response => {

            if (response.data.successMessage != "error") {


                this.setState({
                    services: response.data.data != null ? response.data.data : [],
                });
                $(".Servicetable").bootstrapTable();


            } else {
                confirmAlert({
                    title: 'Error fetching your transactions',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });
            }


        }).catch(error => {
            confirmAlert({
                title: 'Error occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });
        });

        tenantService.getUSSDCodes(clientId).then(response => {

            if (response.data.successMessage != "error") {


                this.setState({
                    codes: response.data.data != null ? response.data.data : [],
                });
                $(".Codetable").bootstrapTable();


            } else {
                confirmAlert({
                    title: 'Error fetching your transactions',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });
            }


        }).catch(error => {
            confirmAlert({
                title: 'Error occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });
        });


        tenantService.getClientDocuments(clientId).then(response => {

            if (response.data.successMessage != "error") {


                this.setState({
                    documents: response.data.data != null ? response.data.data : [],
                });
                $(".Documenttable").bootstrapTable();


            } else {
                confirmAlert({
                    title: 'Error fetching your transactions',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });
            }


        }).catch(error => {
            confirmAlert({
                title: 'Error occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });
        });

    }


    componentDidUnMount() {

        $(".table").each(function (index, value) {

            $(this).bootstrapTable().destroy();

        });

        $(".createInteraction").parsley().destroy();

        $(".interactiondate").datepicker({

        }).destroy();
    }


    removeRange(el, index) {

        let stateCopy = Object.assign({}, this.state);

        stateCopy.formData.splice(index, 1);

        this.setState(stateCopy);
    }

    addNewRange() {

        let stateCopy = Object.assign({}, this.state);
        let newArr = {
            service: stateCopy.clientService.clientService.service,
            lower: null,
            upper: null,
            value: null
        };
        stateCopy.formData.push(newArr);

        this.setState(stateCopy);
    }

    handleChange(el, index) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let stateCopy = Object.assign({}, this.state);
        stateCopy.formData[index][inputName] = inputValue;

        this.setState(stateCopy);


    }


    handleCompleteChange(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let stateCopy = Object.assign({}, this.state);
        stateCopy.completeData[inputName] = inputValue;

        this.setState(stateCopy);

    }


    handleSubmission() {

        const { formData } = this.state;

        // event.preventDefault();
        if (formData.length < 1) {
            alert("Please add costs first");

        } else {

            this.setState({
                loading: true,
            });

            this.handleshowHideRepaymentModal();
            // if ($(".createSource").parsley().isValid()) {
            tenantService.assignClientServiceUnitCosts(this.state.clientService.clientService.id, formData).then(response => {

                if (response.data.status != "error") {
                    confirmAlert({
                        title: 'Success!',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'OK',
                                onClick: () => window.location.reload()
                            }
                        ]
                    });

                } else {
                    confirmAlert({
                        title: 'Error making request',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'Ok',
                            }
                        ]
                    });
                }

            }).catch(error => {
                confirmAlert({
                    title: 'Following Error Occurred',
                    message: error.message,
                    buttons: [
                        {
                            label: 'Ok',
                        }
                    ]
                });
            });

            this.setState({
                loading: false,
            });
        }
    }

    handleChanges(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let stateCopy = Object.assign({}, this.state);
        stateCopy.standingFormData["charge"] = inputValue;

        this.setState(stateCopy);

    }

    handleStandingSubmission() {

        const { standingFormData } = this.state;
        standingFormData.clientServiceId = parseInt(this.state.clientService.clientService.id);
        this.setState({
            loading: true,
        });

        this.handleshowHideStandingModal();
        // if ($(".createSource").parsley().isValid()) {
        tenantService.updateServiceStandingCharge(this.state.customerId, standingFormData).then(response => {

            if (response.data.status != "error") {
                confirmAlert({
                    title: 'Success!',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'OK',
                            onClick: () => window.location.reload()
                        }
                    ]
                });

            } else {
                confirmAlert({
                    title: 'Error making request',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'Ok',
                        }
                    ]
                });
            }

        }).catch(error => {
            confirmAlert({
                title: 'Following Error Occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'Ok',
                    }
                ]
            });
        });

        this.setState({
            loading: false,
        });

    }

    enableSource(el) {


        var username = el.target.dataset.name;
        var id = el.target.dataset.id;


        confirmAlert({
            message: 'Are you sure you want to activate source : ' + username,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        sourceService.activateSource(id, "COMPLETE").then(response => {



                            if (response.data.status == "success") {

                                confirmAlert({
                                    message: 'Succesfully Activated ' + username,
                                    buttons: [
                                        {
                                            label: 'Yes',
                                            onClick: () => window.location.reload()
                                        }
                                    ]
                                });

                            } else if (response.data.status == "error") {

                                confirmAlert({
                                    message: response.data.message,
                                    buttons: [
                                        {
                                            label: 'Ok',
                                        }
                                    ]
                                });

                            }

                        }).catch(error => {

                            confirmAlert({
                                message: error.message,
                                buttons: [
                                    {
                                        label: 'Ok',
                                    }
                                ]
                            });

                        });
                    }
                }, { label: 'No' }
            ]
        });




    }

    disableUser(el) {


        var username = el.target.dataset.name;
        var id = el.target.dataset.id;


        confirmAlert({
            message: 'Are you sure you want to deactivate source : ' + username,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        sourceService.activateSource(id, "INACTIVE").then(response => {



                            if (response.data.status == "success") {

                                confirmAlert({
                                    message: 'Succesfully Deactivated ' + username,
                                    buttons: [
                                        {
                                            label: 'Yes',
                                            onClick: () => window.location.reload()
                                        }
                                    ]
                                });

                            } else if (response.data.status == "error") {

                                confirmAlert({
                                    message: 'Error Submitting Data for ' + username,
                                    buttons: [
                                        {
                                            label: 'Ok',
                                        }
                                    ]
                                });

                            }

                        }).catch(error => {

                            confirmAlert({
                                message: error.message,
                                buttons: [
                                    {
                                        label: 'Ok',
                                    }
                                ]
                            });

                        });
                    }
                }, { label: 'No' }
            ]
        });




    }

    fetchUsers(id) {

        this.setState({
            loading: true
        });

        tenantService.getAllClientUsers(id).then(response => {



            if (response.data.status != "error") {

                this.setState({
                    users: response.data.data,
                    loading: false,
                });
                $('.adminstable').bootstrapTable({
                    exportDataType: 'all',
                    exportTypes: ['json', 'csv', 'excel'],
                });
                // $('.table').dataTable({});
                // $(".table #table_filter input").attr("placeHolder", "Search");

            } else {
                confirmAlert({

                    // title: 'Error',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });

                this.setState({
                    loading: false,
                });
            }


        }).catch(error => {

            this.setState({
                loading: false,
            });
            confirmAlert({
                title: 'Following Error Occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'Ok',
                    }
                ]
            });
        });

        tenantService.getClientTransactions(id).then(response => {



            if (response.data.status != "error") {

                this.setState({
                    billingTransactions: response.data.data,
                    loading: false,
                });
                $('.billingtable').bootstrapTable({
                    exportDataType: 'all',
                    exportTypes: ['json', 'csv', 'excel'],
                });
            } else {
                confirmAlert({

                    // title: 'Error',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });

                this.setState({
                    loading: false,
                });
            }


        }).catch(error => {

            this.setState({
                loading: false,
            });
            confirmAlert({
                message: error.message,
                buttons: [
                    {
                        label: 'Ok',
                    }
                ]
            });
        });


    }

    enableUser(el) {


        var username = el.target.dataset.name;


        confirmAlert({
            message: 'Are you sure you want to enable ' + username,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        userService.enableUser(username).then(response => {



                            if (response.data.status == "success") {

                                this.setState({

                                    emailSuccessful: response.data.message

                                });

                                confirmAlert({
                                    message: 'Succesfully Activated ' + username,
                                    buttons: [
                                        {
                                            label: 'Yes',
                                            onClick: () => window.location.reload()
                                        }
                                    ]
                                });

                            } else if (response.data.status == "error") {

                                confirmAlert({
                                    message: response.data.message,
                                    buttons: [
                                        {
                                            label: 'Ok',
                                        }
                                    ]
                                });

                            }

                        }).catch(error => {

                            confirmAlert({
                                message: error.message,
                                buttons: [
                                    {
                                        label: 'Ok',
                                    }
                                ]
                            });

                        });
                    }
                }, { label: 'No' }
            ]
        });




    }

    unlockUserAccount(el) {


        var id = el.target.dataset.id;
        confirmAlert({
            message: "Are you sure you want to unlock this user's account? ",
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        userService.unlockUserAccount(id).then(response => {



                            if (response.data.status == "success") {

                                this.setState({

                                    emailSuccessful: response.data.message

                                });

                                confirmAlert({
                                    message: 'Succesfully unlocked the account!',
                                    buttons: [
                                        {
                                            label: 'Yes',
                                            onClick: () => window.location.reload()
                                        }
                                    ]
                                });

                            } else if (response.data.status == "error") {

                                confirmAlert({
                                    message: response.data.message,
                                    buttons: [
                                        {
                                            label: 'Ok',
                                        }
                                    ]
                                });

                            }

                        }).catch(error => {

                            confirmAlert({
                                message: error.message,
                                buttons: [
                                    {
                                        label: 'Ok',
                                    }
                                ]
                            });

                        });
                    }
                }, { label: 'No' }
            ]
        });

    }

    deactivateUser(el) {
        var id = el.target.dataset.id;
        confirmAlert({
            message: "Are you sure you want to unlock this user's account? ",
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {

                        userService.deactivate(id).then(response => {
                            if (response.data.status == "success") {

                                this.setState({

                                    emailSuccessful: response.data.message

                                });
                                window.location.reload()


                            } else {
                                confirmAlert({
                                    title: 'Error occurred on user deactivation',
                                    message: response.data.message,
                                    buttons: [
                                        {
                                            label: 'ok',
                                        }
                                    ]
                                });
                            }

                        }).catch(error => {

                            confirmAlert({
                                title: 'Error occurred',
                                message: error.message,
                                buttons: [
                                    {
                                        label: 'ok',
                                    }
                                ]
                            });

                        });
                    }
                }, { label: 'No' }
            ]
        });

    }

    render() {

        const { client, smsBalance,
            sentSms,
            scheduledSms, billingTransactions,
            sentScheduledSms, loading,
            users } = this.state;

        return (
            <>

                <div id="content" className="flex ">


                    <div className="page-container" id="page-container">

                        <div className="padding">

                            {/* Tabs Header */}
                            <div className="card">

                                <div className="card-header bg-dark bg-img p-0 no-border customerHighlights">

                                    <div className="bg-dark-overlay r-2x no-r-b">

                                        <div className="d-md-flex">

                                            <div className="p-4 customerBio">

                                                <div className="d-flex">

                                                    <div className="mx-3">
                                                        <h5 className="mt-2">{client != "" ? client.name : ""}</h5>
                                                        <div className=""> <small>{client.physicalAddress || ""}</small></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <span className="flex"></span>

                                            <div className="pinOptions align-items-center d-flex">
                                                {/* End Reset Pin 
                                                <button
                                                    className="btn-primary"
                                                    onClick={() => this.resetPinModal()}>Reset Pin
                                            </button>
                                            */}

                                            </div>

                                            {/* Customer Status */}
                                            <div className="align-items-center d-flex p-4">
                                                <div className="toolbar">
                                                    <a href="#" className="btn btn-sm bg-dark-overlay btn-rounded text-white bg-success active" data-toggle-class="bg-success">
                                                        <span className="d-inline">{client.status ? "Active" : "Inactive"}</span>
                                                        <span className="d-none">{client.status ? "Active" : "Inactive"}</span>
                                                    </a>

                                                </div>
                                            </div>
                                            {/* End Customer Status*/}

                                        </div>

                                    </div>
                                </div>

                                {/* Tab Navigation */}
                                <div className="px-2">

                                    <div className="d-flex nav-active-border nav-active-text-primary b-primary">

                                        <ul className="nav ">


                                            <li className="nav-item">
                                                <a className="nav-link py-3 active" href="#" data-toggle="tab" data-target="#business">Dashboard</a>
                                            </li>

                                            <li className="nav-item">
                                                <a className="nav-link py-3" href="#" data-toggle="tab" data-target="#services">Services</a>
                                            </li>

                                            <li className="nav-item">
                                                <a className="nav-link py-3" href="#" data-toggle="tab" data-target="#billing">Billing Transactions</a>
                                            </li>


                                            <li className="nav-item">
                                                <a className="nav-link py-3" href="#" data-toggle="tab" data-target="#docs">Documents</a>
                                            </li>

                                            <li className="nav-item">
                                                <a className="nav-link py-3" href="#" data-toggle="tab" data-target="#sources">SMS Sources</a>
                                            </li>

                                            <li className="nav-item">
                                                <a className="nav-link py-3" href="#" data-toggle="tab" data-target="#codes">USSD Codes</a>
                                            </li>

                                            <li className="nav-item">
                                                <a className="nav-link py-3" href="#" data-toggle="tab" data-target="#admins">Admins</a>
                                            </li>

                                            <li className="nav-item">
                                                <a className="nav-link py-3" href="#" data-toggle="tab" data-target="#biodata">Bio Data</a>
                                            </li>



                                        </ul>

                                    </div>
                                </div>
                                {/* End Tab Navigation*/}
                            </div>
                            {/* End Tabs Header*/}
                            {/* Tab Container  */}
                            <div className="row">

                                <div className="col-sm-12 col-lg-12">

                                    {/* Tab Content  */}
                                    <div className="tab-content">

                                        {/* Bio Data */}
                                        <div className="tab-pane  fade" id="biodata">
                                            <div className="card">

                                                <div className="px-2"><div className="py-3">



                                                    <ul className="nav flex-column">

                                                        <li className="nav-item">
                                                            <a className="nav-link i-con-h-a">
                                                                <i className="i-con i-con-pin"></i>
                                                                <span className="mx-2">{(client.state + " " + client.physicalAddress + " ") || ""}</span>
                                                            </a>
                                                        </li>

                                                        <li className="nav-item">
                                                            <a className="nav-link i-con-h-a">
                                                                <i className="i-con i-con-account"><i></i></i>
                                                                <span className="mx-2">{client.clientType || ""}</span>
                                                            </a>
                                                        </li>

                                                        <li className="nav-item">
                                                            <a className="nav-link i-con-h-a">
                                                                <i className="i-con i-con-mail"><i></i></i>
                                                                <span className="mx-2">{client.email || ""}</span>
                                                            </a>
                                                        </li>

                                                        <li className="nav-item">
                                                            <a className="nav-link i-con-h-a">
                                                                <i className="i-con i-con-web"><i></i></i>
                                                                <span className="mx-2">{client.website != undefined ? <> <a href={client.website} target="blank" >Visit Website</a> </> : ""}</span>
                                                            </a>
                                                        </li>

                                                    </ul>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* End Bio Data*/}

                                        <div className="tab-pane active " id="business">
                                            <div className="card">

                                                <div className="px-4 py-4">

                                                    <div className="row">

                                                        <div className="col-sm-12 col-lg-12">

                                                            {/* Tab Content  */}
                                                            <div className="tab-content">
                                                                {/* Tab 1 */}

                                                                <div className="tab-pane active" id="tab_1">

                                                                    {!loading &&
                                                                        <div className="row">
                                                                            {smsBalance != undefined && <SummaryIcon
                                                                                amount={"KES " + utils.formatNumber(smsBalance)}
                                                                                title="SMS Balance"
                                                                                icon={faHandHoldingUsd}
                                                                            />}

                                                                            {/* Summary Icon */}
                                                                            {sentSms != undefined && <SummaryIcon
                                                                                amount={sentSms}
                                                                                title="Total SMS Sent"
                                                                                icon={faCalculator}
                                                                            />}

                                                                            {/* End Summary Icon*/}

                                                                            {/* Summary Icon */}
                                                                            {scheduledSms != undefined && <SummaryIcon
                                                                                amount={scheduledSms}
                                                                                title="Scheduled SMS"
                                                                                icon={faTimesCircle}
                                                                            />}
                                                                            {/* End Summary Icon*/}

                                                                            {/* Summary Icon */}
                                                                            {sentScheduledSms != undefined && <SummaryIcon
                                                                                amount={sentScheduledSms}
                                                                                title="Sent Scheduled SMS   "
                                                                                icon={faHourglass}
                                                                            />}
                                                                            {/* End Summary Icon*/}
                                                                        </div>
                                                                    }
                                                                    {/* 
            <h3>Latest Loan Requests</h3> */}
                                                                    {loading == true &&
                                                                        <Loader type="dots" />
                                                                    }

                                                                </div>
                                                                {/* End Tab 1*/}

                                                            </div>
                                                            {/* End Tab Content  */}
                                                        </div>
                                                    </div>
                                                    {(!loading && this.state.chartdata != "") &&
                                                        <div className="row">

                                                            <div className="col-sm-12 col-lg-12">
                                                                <Chart
                                                                    title="My SMS Usage"
                                                                    charttype="bar"
                                                                    chartdata={this.state.chartdata}
                                                                    secondaryTitle="Sent SMS graph" />

                                                            </div>
                                                        </div>
                                                    }



                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade " id="billing">
                                            <div className="card">

                                                <div className="px-4 py-4">

                                                    <div className="row">
                                                        <Modal show={this.state.showcomplete}>
                                                            <Modal.Header closeButton onClick={() => this.handleshowHideCompleteModal()}>
                                                                <Modal.Title>Complete Payment</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <form className="selectProductForm" data-plugin="parsley" onSubmit={this.handleComletePaymentSubmission} >
                                                                    <div
                                                                        className="col-12">

                                                                        <label>Payment Reference</label>

                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            data-parsley-required="true"
                                                                            onChange={this.handleCompleteChange}
                                                                            name="txncd"
                                                                            id="txncd" />

                                                                    </div>

                                                                    <div
                                                                        className="col-12">

                                                                        <label>Status</label>
                                                                        <select name="status" id="status" className="form-control"
                                                                            onChange={this.handleCompleteChange}>
                                                                            <option></option>
                                                                            <option value="SUCCESS">SUCCESS</option>
                                                                            <option value="FAILED">FAILED</option>
                                                                            <option></option>
                                                                        </select>

                                                                    </div>
                                                                    <button className="btn-primary" type="submit">Submit</button>
                                                                </form>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={() => this.handleshowHideCompleteModal()}>
                                                                    Close
                                                                </Button>

                                                            </Modal.Footer>
                                                        </Modal>

                                                        <table
                                                            className="table table-theme v-middle table-row"
                                                            id="table"
                                                            data-toolbar="#toolbar"
                                                            data-search="true"
                                                            data-search-align="left"
                                                            data-show-columns="true"
                                                            data-show-export="true"
                                                            data-mobile-responsive="true"
                                                            data-pagination="true"
                                                            data-page-list="[10, 25, 50, 100, ALL]"
                                                        >

                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>Invoice No</th>
                                                                    <th>Units</th>
                                                                    <th>Amount</th>
                                                                    <th>Date Purchased</th>
                                                                    <th>Status</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>


                                                                {billingTransactions != "" &&
                                                                    billingTransactions.map((mes, index) => {

                                                                        return (


                                                                            <tr className=" " key={mes.id} >


                                                                                <td>
                                                                                    <span className="text-muted">{mes.id}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.invoiceId}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.units}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.amount == 0 ? "FREE" : mes.amount}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{utils.formatDateString(mes.dateTimeCreated)}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.status}</span>
                                                                                </td>

                                                                                <td>
                                                                                    {mes.status == "NEW" &&
                                                                                        <button className="btn-primary completePayment" data-id={mes.invoiceId} type="button">Complete Payment</button>
                                                                                    }
                                                                                </td>

                                                                            </tr>

                                                                        );

                                                                    })
                                                                }

                                                            </tbody>

                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade " id="services">
                                            <div className="card">

                                                <div className="px-4 py-4">

                                                    <div className="row">
                                                        <table
                                                            className="table table-theme v-middle table-row Servicetable"
                                                            id="table"
                                                            data-toolbar="#toolbar"
                                                            data-search="true"
                                                            data-search-align="left"
                                                            data-show-columns="true"
                                                            data-show-export="true"
                                                            data-detail-view="false"
                                                            data-mobile-responsive="true"
                                                            data-pagination="true"
                                                            data-page-list="[10, 25, 50, 100, ALL]"
                                                        >

                                                            <thead>
                                                                <tr>

                                                                    <th>#</th>
                                                                    <th>Service Type</th>
                                                                    <th>Billing Type</th>
                                                                    <th>Status</th>
                                                                    <th>Balance</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>


                                                                {this.state.services != "" &&
                                                                    this.state.services.map((mes, index) => {

                                                                        return (


                                                                            <tr className=" " key={mes.id} >



                                                                                <td>
                                                                                    <span className="text-muted">{index + 1}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.service.service + (mes.service.service == "USSD" ? (" Code : " + mes.code.value) : "")}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.service.billingType}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.service.status}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.service.runningBalance} units</span>
                                                                                </td>

                                                                                <td>
                                                                                    <div className="item-action dropdown">
                                                                                        <a href="#" data-toggle="dropdown" className="text-muted"><i className="i-con i-con-more"><i></i></i></a>

                                                                                        <div className="dropdown-menu dropdown-menu-right bg-dark" role="menu">
                                                                                            <button className="btn dropdown-item openCostsModal" data-id={mes.service.id} >Service Costs</button>
                                                                                            <button className="btn dropdown-item updateStandingChargeModal" data-id={mes.service.id} data-charge={mes.service.standingCharge} >{mes.service.standingCharge != null ? "Update Standing Charge" : "Assign Standing Charge"}</button>

                                                                                            {/* can gen report if service is not PREPAID SMS */}
                                                                                            {(mes.service.service === "USSD" || (mes.service.billingType != "PREPAID" && mes.service.service === "SMS")) &&
                                                                                                <button className="btn dropdown-item usageModal" data-id={mes.service.id}>
                                                                                                    Usage Report
                                                                                                </button>
                                                                                            }


                                                                                        </div>

                                                                                    </div>
                                                                                </td>

                                                                            </tr>

                                                                        );

                                                                    })
                                                                }

                                                            </tbody>

                                                        </table>

                                                        <Modal show={this.state.showStandingCharges}>
                                                            <Modal.Header closeButton onClick={() => this.handleshowHideStandingModal()}>
                                                                <Modal.Title> Service Standing Charge</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <p>Current Standing Charge : {this.state.charge == undefined ? 0 : this.state.charge}</p>
                                                                <form className="form standingForm">
                                                                    <div className="form-group">
                                                                        <label>Charge</label>
                                                                        <input type="number" name="charge" id="charge" onChange={this.handleChanges} />
                                                                    </div>

                                                                </form>

                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={() => this.handleshowHideStandingModal()}>
                                                                    Close
                                                                </Button>

                                                                <Button variant="primary" onClick={() => this.handleStandingSubmission()}>
                                                                    Submit
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>

                                                        {/* Usage modal */}
                                                        <Modal show={this.state.showUsageModal}>
                                                            <Modal.Header closeButton onClick={() => this.handleshowHideUsageModal()}>
                                                                <Modal.Title> Service Usage</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <div className="row">
                                                                    <div className="col-lg-12 pb-2 pl-0 pr-0">

                                                                        <form className="fetchMessages">
                                                                            <div
                                                                                className="row messageFilter padding">

                                                                                <div
                                                                                    className="col-4">

                                                                                    <label>Start Date*</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control startdate"
                                                                                        data-parsley-required="true"
                                                                                    />

                                                                                    <input
                                                                                        type="hidden"
                                                                                        name="startdate"
                                                                                        id="startdate" />

                                                                                </div>

                                                                                <div
                                                                                    className="col-4">

                                                                                    <label>End Date*</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control enddate"
                                                                                        data-parsley-required="true"

                                                                                    />

                                                                                    <input
                                                                                        type="hidden"
                                                                                        name="enddate"
                                                                                        id="enddate" />
                                                                                </div>
                                                                                <div
                                                                                    className="col-4 ">
                                                                                    <button
                                                                                        className="btn-primary" onClick={this.getClientServiceUsageReport}
                                                                                        type="button">Submit</button>
                                                                                </div>
                                                                            </div>

                                                                        </form>

                                                                    </div>

                                                                </div>
                                                                {loading && <Loader type="dots" />}
                                                                <div className="row padding">
                                                                    {this.state.usageReport.clientService != "" &&
                                                                        <>
                                                                            <table className="table usageItemsTable">
                                                                                <tr>
                                                                                    <th>Item</th>
                                                                                    <th>Amount</th>
                                                                                </tr>
                                                                                {this.state.usageReport.summaryItemModels != "" && this.state.usageReport.summaryItemModels.map((item, index) => (
                                                                                    <tr>
                                                                                        <td>{item.item}</td>
                                                                                        <td>{item.count}</td>
                                                                                    </tr>
                                                                                ))
                                                                                }
                                                                                <tr>
                                                                                    <td>Standing charge</td>
                                                                                    <td>{this.state.usageReport.standingCharge}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Usage charge</td>
                                                                                    <td>{this.state.usageReport.serviceUsageCharge}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Total</td>
                                                                                    <td>{this.state.usageReport.total}</td>
                                                                                </tr>
                                                                            </table>

                                                                        </>
                                                                    }

                                                                </div>

                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={() => this.handleshowHideUsageModal()}>
                                                                    Close
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>

                                                        {/* service costs modal */}
                                                        <Modal show={this.state.showCosts}>
                                                            <Modal.Header closeButton onClick={() => this.handleshowHideRepaymentModal()}>
                                                                <Modal.Title> Service Costs</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>

                                                                <Button variant="secondary" onClick={() => this.addNewRange()}>
                                                                    Add New Range
                                                                </Button>


                                                                {this.state.loadingService ?
                                                                    <Loader type="circle" /> : <>
                                                                        {this.state.formData.length > 0 ? <>
                                                                            {this.state.formData != "" && this.state.formData.map((cost, index) => (
                                                                                <div className="row">
                                                                                    <div
                                                                                        className="col-3">

                                                                                        <label>Service</label>
                                                                                        <select

                                                                                            className="form-control"
                                                                                            value={cost.service} disabled
                                                                                            data-parsley-required="true"
                                                                                            data-parsley-minlength='12'
                                                                                            data-parsley-maxlength='12'
                                                                                            onChange={(e) => this.handleChange(e, index)}
                                                                                            name="service"
                                                                                            id="service">
                                                                                            <option></option>
                                                                                            <option value="SMS">SMS</option>
                                                                                            <option value="USSD">USSD</option>

                                                                                        </select>

                                                                                    </div>
                                                                                    <div
                                                                                        className="col-3">

                                                                                        <label>Min</label>

                                                                                        <input
                                                                                            type="number"
                                                                                            placeholder="2547..."
                                                                                            className="form-control"
                                                                                            value={cost.lower}
                                                                                            data-parsley-required="true"
                                                                                            data-parsley-minlength='12'
                                                                                            data-parsley-maxlength='12'
                                                                                            onChange={(e) => this.handleChange(e, index)}
                                                                                            name="lower"
                                                                                            id="lower" />

                                                                                    </div>
                                                                                    <div
                                                                                        className="col-3">

                                                                                        <label>Max</label>

                                                                                        <input
                                                                                            type="number"
                                                                                            placeholder="2547..."
                                                                                            className="form-control"
                                                                                            value={cost.upper}
                                                                                            data-parsley-required="true"
                                                                                            data-parsley-minlength='12'
                                                                                            data-parsley-maxlength='12'
                                                                                            onChange={(e) => this.handleChange(e, index)}
                                                                                            name="upper"
                                                                                            id="upper" />

                                                                                    </div>
                                                                                    <div
                                                                                        className="col-3">

                                                                                        <label>Cost per Unit</label>

                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder="2547..."
                                                                                            className="form-control"
                                                                                            value={cost.value}
                                                                                            data-parsley-required="true"
                                                                                            data-parsley-minlength='12'
                                                                                            data-parsley-maxlength='12'
                                                                                            onChange={(e) => this.handleChange(e, index)}
                                                                                            name="value"
                                                                                            id="value" />

                                                                                    </div>
                                                                                    <div
                                                                                        className="col-3">

                                                                                        <Button variant="secondary" onClick={(e) => this.removeRange(e, index)}>
                                                                                            X
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>

                                                                            ))


                                                                            } </> : <>
                                                                            <p>This service is charged the default unit cost values</p>
                                                                        </>}

                                                                    </>
                                                                }
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={() => this.handleshowHideRepaymentModal()}>
                                                                    Close
                                                                </Button>

                                                                <Button variant="primary" onClick={() => this.handleSubmission()}>
                                                                    Submit
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>



                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade " id="docs">
                                            <div className="card">

                                                <div className="px-4 py-4">

                                                    <div className="row">

                                                        <table
                                                            className="table table-theme v-middle table-row Documenttable"
                                                            id="table"
                                                            data-toolbar="#toolbar"
                                                            data-search="true"
                                                            data-search-align="left"
                                                            data-show-columns="true"
                                                            data-show-export="true"
                                                            data-detail-view="false"
                                                            data-mobile-responsive="true"
                                                            data-pagination="true"
                                                            data-page-list="[10, 25, 50, 100, ALL]"
                                                        >

                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>Document</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>


                                                                {this.state.documents != "" &&
                                                                    this.state.documents.map((mes, index) => {

                                                                        return (


                                                                            <tr className=" " key={mes.id} >


                                                                                <td>
                                                                                    <span className="text-muted">{mes.id}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.docType}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <a href={clientBaseUrl + "documents/download?docName=" + mes.documentName}>Download</a>

                                                                                </td>

                                                                            </tr>

                                                                        );

                                                                    })
                                                                }

                                                            </tbody>

                                                        </table>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade " id="sources">
                                            <div className="card">

                                                <div className="px-4 py-4">

                                                    <div className="row">


                                                        <table
                                                            className="table table-theme v-middle table-row Sourcetable"
                                                            id="table"
                                                            data-toolbar="#toolbar"
                                                            data-search="true"
                                                            data-search-align="left"
                                                            data-show-columns="true"
                                                            data-show-export="true"
                                                            data-mobile-responsive="true"
                                                            data-pagination="true"
                                                            data-page-list="[10, 25, 50, 100, ALL]"
                                                        >

                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>Source</th>
                                                                    <th>Type</th>
                                                                    <th>Provider</th>
                                                                    <th>Date Created</th>
                                                                    <th>Status</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>


                                                                {this.state.sources != "" &&
                                                                    this.state.sources.map((mes, index) => {

                                                                        return (


                                                                            <tr className=" " key={mes.id} >


                                                                                <td>
                                                                                    <span className="text-muted">{mes.id}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.senderId}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.type}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.provider != undefined ? mes.provider : "SAFARICOM"}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{utils.formatDateString(mes.dateTimeCreated)}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.status}</span>
                                                                                </td>
                                                                                {/* <td>
                                                            <span className="text-muted">KES {mes.smsBalance}</span>
                                                        </td> */}

                                                                                <td>
                                                                                    <div className="item-action dropdown">
                                                                                        <a href="#" data-toggle="dropdown" className="text-muted"><i className="i-con i-con-more"><i></i></i></a>

                                                                                        <div className="dropdown-menu dropdown-menu-right bg-dark" role="menu">
                                                                                            {mes.status !== "COMPLETE" ?
                                                                                                <button className="dropdown-item commissionSource" data-id={mes.id} data-name={mes.senderId}>Commission Source</button>
                                                                                                : <button className="dropdown-item decommissionSource" data-id={mes.id} data-name={mes.senderId}>Deactivate Source</button>
                                                                                            }

                                                                                        </div>

                                                                                    </div>
                                                                                </td>


                                                                            </tr>

                                                                        );

                                                                    })
                                                                }

                                                            </tbody>

                                                        </table>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade " id="codes">
                                            <div className="card">

                                                <div className="px-4 py-4">

                                                    <div className="row">
                                                        <table
                                                            className="table table-theme v-middle table-row Codetable"
                                                            id="table"
                                                            data-toolbar="#toolbar"
                                                            data-search="true"
                                                            data-search-align="left"
                                                            data-show-columns="true"
                                                            data-show-export="true"
                                                            data-detail-view="false"
                                                            data-mobile-responsive="true"
                                                            data-pagination="true"
                                                            data-page-list="[10, 25, 50, 100, ALL]"
                                                        >

                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>Code</th>
                                                                    <th>Provider</th>
                                                                    <th>Status</th>
                                                                    <th>Callback Url</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>


                                                                {this.state.codes != "" &&
                                                                    this.state.codes.map((mes, index) => {

                                                                        return (


                                                                            <tr className=" " key={mes.id} >


                                                                                <td>
                                                                                    <span className="text-muted">{mes.code.id}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.code.value}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.code.provider}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.code.status}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="text-muted">{mes.code.callbackUrl}</span>
                                                                                </td>

                                                                            </tr>

                                                                        );

                                                                    })
                                                                }

                                                            </tbody>

                                                        </table>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="tab-pane fade " id="admins">
                                            <div className="card">

                                                <div className="px-4 py-4">

                                                    <div className="row">
                                                        <table
                                                            className="table table-theme v-middle table-row adminstable"
                                                            id="table"
                                                            data-toolbar="#toolbar"
                                                            data-search="true"
                                                            data-search-align="left"
                                                            data-show-columns="true"
                                                            data-show-export="true"
                                                            data-detail-view="false"
                                                            data-mobile-responsive="true"
                                                            data-pagination="true"
                                                            data-page-list="[10, 25, 50, 100, ALL]"
                                                        >

                                                            <thead>
                                                                <tr>
                                                                    <th>User name</th>
                                                                    <th>First Name</th>
                                                                    <th>Last Name</th>
                                                                    <th>Role </th>
                                                                    <th>Email </th>
                                                                    <th>Activated </th>
                                                                    <th>Actions </th>

                                                                </tr>
                                                            </thead>

                                                            <tbody>



                                                                {users != "" &&
                                                                    users.map((user, index) => {

                                                                        return (


                                                                            <tr className=" " key={user.user.id} >


                                                                                <td>
                                                                                    <span className="">{user.user.userName}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="">{user.user.firstName}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className="">{user.user.lastName}</span>
                                                                                </td>

                                                                                <td>
                                                                                    {<span className="">{user.user.role.name}</span>}
                                                                                </td>


                                                                                <td>
                                                                                    <span className="">{user.user.email}</span>
                                                                                </td>

                                                                                <td>
                                                                                    <span className=""><Badge description={user.user.enabled.toString()}
                                                                                        type={user.user.enabled.toString()} /></span>
                                                                                </td>

                                                                                <td>

                                                                                    <span className="padding">
                                                                                        <a href={'/portal/viewuser/' + user.user.id} >
                                                                                            <FontAwesomeIcon icon={faEye} color="#49bcd7"></FontAwesomeIcon>
                                                                                        </a>
                                                                                    </span>
                                                                                    <span className="padding">
                                                                                        <a href={'/portal/edituser/' + user.user.id} >
                                                                                            <FontAwesomeIcon icon={faPen} color="#49bcd7"></FontAwesomeIcon>
                                                                                        </a>
                                                                                    </span>

                                                                                    {user.user.enabled &&
                                                                                        <span className="padding disableUser">
                                                                                            <FontAwesomeIcon
                                                                                                icon={faToggleOff}
                                                                                                color="#49bcd7"
                                                                                                data-id={user.user.id}
                                                                                                data-name={user.user.userName}
                                                                                                className=""></FontAwesomeIcon>

                                                                                        </span>}
                                                                                    {!user.user.enabled &&
                                                                                        <span className="padding enableUser">
                                                                                            <FontAwesomeIcon icon={faToggleOn} color="#49bcd7"
                                                                                                data-id={user.user.id}
                                                                                                data-name={user.user.userName}
                                                                                                className=""></FontAwesomeIcon>
                                                                                        </span>}

                                                                                    {user.user.accountLocked &&
                                                                                        <span className="padding unlockUser">
                                                                                            <FontAwesomeIcon icon={faLockOpen} color="#49bcd7"
                                                                                                data-id={user.user.id}
                                                                                                data-name={user.user.userName}
                                                                                                className=""></FontAwesomeIcon>
                                                                                        </span>}

                                                                                </td>


                                                                            </tr>

                                                                        );

                                                                    })
                                                                }

                                                            </tbody>

                                                        </table>



                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </>
        )

    }

}
