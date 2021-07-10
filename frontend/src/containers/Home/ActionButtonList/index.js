import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { executeMarket, pauseMarket, resumeMarket, claimTreasury, setTreasuryRate } from 'services/prediction'
import { AppContext } from 'contexts';
import ContainedButton from 'components/UI/Buttons/ContainedButton';

const useStyles = makeStyles(theme => ({
    root: {},
    image: {
      boxShadow:
        '25px 60px 125px -25px rgba(80,102,144,.1), 16px 40px 75px -40px rgba(0,0,0,.2)',
      borderRadius: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        maxWidth: 500,
        marginBottom: 60
      },
    },
    mobileImageContainer: {
      [theme.breakpoints.down('sm')]: {
        position: 'absolute', left: 0, marginTop: 20,
      },
      position: 'absolute', right: 0, marginTop: 20,
    },
    buyMarsButton: {
      backgroundColor: theme.palette.error.light
    }
  }));

const ActionButtonList = props => {
    const classes = useStyles();
    const theme = useTheme();
    const { token } = useContext(AppContext)
    const [ executeLoading, setExecuteLoading ] = useState(false);
    const [ pauseLoading, setPauseLoading ] = useState(false);
    const [ resumeLoading, setResumeLoading ] = useState(false);
    const [ claimLoading, setClaimLoading ] = useState(false);
    const [ treasuryRateLoading, setTreasuryRateLoading ] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
      defaultMatches: true,
    });

    const handleClickExecute = (event) => {
      if (!token)
        enqueueSnackbar("You are not operator!", { variant: 'error' });
      else {
        setExecuteLoading(true);
        executeMarket(token)
        .then(result => {
          enqueueSnackbar("Successfully Execute Market", { variant: 'success' });
          setExecuteLoading(false);
        })
        .catch(err => {
          enqueueSnackbar("Error occured while executing Market!", { variant: 'error' });
          setExecuteLoading(false);
        }) 
      }
    }
    const handleClickPause = (event) => {
      if (!token)
        enqueueSnackbar("You are not operator!", { variant: 'error' });
      else {
        setPauseLoading(true);
        pauseMarket(token)
        .then(result => {
          enqueueSnackbar("Successfully Pause Market", { variant: 'success' });
          setPauseLoading(false);
        })
        .catch(err => {
          enqueueSnackbar("Error occured while Pause Market!", { variant: 'error' });
          setPauseLoading(false);
        }) 
      }
    }
    const handleClickResume = (event) => {
      if (!token)
        enqueueSnackbar("You are not operator!", { variant: 'error' });
      else {
        setResumeLoading(true);
        resumeMarket(token)
        .then(result => {
          enqueueSnackbar("Successfully Resume Market", { variant: 'success' });
          setResumeLoading(false);
        })
        .catch(err => {
          enqueueSnackbar("Error occured while Resume Market!", { variant: 'error' });
          setResumeLoading(false);
        }) 
      }
    }
    const handleClaimTreasury = (event) => {
      if (!token)
        enqueueSnackbar("You are not operator!", { variant: 'error' });
      else {
        setClaimLoading(true);
        claimTreasury(token)
        .then(result => {
          enqueueSnackbar("Successfully Claim Treasury", { variant: 'success' });
          setClaimLoading(false);
        })
        .catch(err => {
          enqueueSnackbar("Error occured while Claim Treasury!", { variant: 'error' });
          setClaimLoading(false);
        }) 
      }
    }
    const handleSetTreasuryRate = (event) => {
      if (!token)
        enqueueSnackbar("You are not operator!", { variant: 'error' });
      else {
        setTreasuryRateLoading(true);
        setTreasuryRate(token, 2.5)
        .then(result => {
          enqueueSnackbar("Successfully Set TreasuryRate", { variant: 'success' });
          setTreasuryRateLoading(false);
        })
        .catch(err => {
          enqueueSnackbar("Error occured while Set TreasuryRate!", { variant: 'error' });
          setTreasuryRateLoading(false);
        }) 
      }
    }
    return (
        <div className={clsx(classes.root)}>
          <Grid
            container
            justify="center"
            spacing={1}
            direction={isMd ? 'row' : 'column-reverse'}
          >
            <ContainedButton style={{ display: 'flex', backgroundColor: '#292C40', marginRight: 8 }} disabled={executeLoading || pauseLoading || resumeLoading || claimLoading || treasuryRateLoading} onClick={handleClickExecute}>Execute Round {executeLoading?<CircularProgress size="15px"/> : ''}</ContainedButton>
            <ContainedButton style={{ display: 'flex', backgroundColor: '#292C40', marginRight: 8 }} disabled={executeLoading || pauseLoading || resumeLoading || claimLoading || treasuryRateLoading} onClick={handleClickPause}>Pause Market {pauseLoading?<CircularProgress size="15px"/> : ''}</ContainedButton>
            <ContainedButton style={{ display: 'flex', backgroundColor: '#292C40', marginRight: 8 }} disabled={executeLoading || pauseLoading || resumeLoading || claimLoading || treasuryRateLoading} onClick={handleClickResume}>Resume Market {resumeLoading?<CircularProgress size="15px"/> : ''}</ContainedButton>
            <ContainedButton style={{ display: 'flex', backgroundColor: '#292C40', marginRight: 8 }} disabled={executeLoading || pauseLoading || resumeLoading || claimLoading || treasuryRateLoading} onClick={handleClaimTreasury}>Claim Treasury {claimLoading?<CircularProgress size="15px"/> : ''}</ContainedButton>
            <ContainedButton style={{ display: 'flex', backgroundColor: '#292C40', marginRight: 8 }} disabled={executeLoading || pauseLoading || resumeLoading || claimLoading || treasuryRateLoading} onClick={handleSetTreasuryRate}>Set TreasuryRate {treasuryRateLoading?<CircularProgress size="15px"/> : ''}</ContainedButton>
          </Grid>
        </div>
      );
}

export default ActionButtonList;