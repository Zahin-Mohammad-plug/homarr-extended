import { Box, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { createStyles, useMantineTheme } from '@mantine/styles';
import { motion } from 'framer-motion';
import { useExternalUrl } from '~/hooks/useExternalUrl';
import { AppType } from '~/types/app';
import axios from 'axios';

import { useEditModeStore } from '../../Views/useEditModeStore';
import { HomarrCardWrapper } from '../HomarrCardWrapper';
import { BaseTileProps } from '../type';
import { AppMenu } from './AppMenu';
import { AppPing } from './AppPing';

interface AppTileProps extends BaseTileProps {
  app: AppType;
}

export const AppTile = ({ className, app }: AppTileProps) => {
  const isEditMode = useEditModeStore((x) => x.enabled);
  const { cx, classes } = useStyles();
  const { colorScheme } = useMantineTheme();
  const tooltipContent = [
    app.appearance.appNameStatus === 'hover' ? app.name : undefined,
    app.behaviour.tooltipDescription,
  ]
    .filter((e) => e)
    .join(': ');

  const isRow = app.appearance.positionAppName.includes('row');
  const href = useExternalUrl(app);

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

  // Function to handle starting a service
  const startService = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/start/${app.name}`, null, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      alert(response.data.status);
    } catch (error) {
      console.error("Error starting service:", error);
      alert("Failed to start service");
    }
  };

  // Function to handle stopping a service
  const stopService = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/stop/${app.name}`, null, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      alert(response.data.status);
    } catch (error) {
      console.error("Error stopping service:", error);
      alert("Failed to stop service");
    }
  };

  // Function to handle restarting a service
  const restartService = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/restart/${app.name}`, null, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      alert(response.data.status);
    } catch (error) {
      console.error("Error restarting service:", error);
      alert("Failed to restart service");
    }
  };


  function Inner() {
    return (
      <Tooltip.Floating
        label={tooltipContent}
        position="right-start"
        c={colorScheme === 'light' ? 'black' : 'dark.0'}
        color={colorScheme === 'light' ? 'gray.2' : 'dark.4'}
        multiline
        disabled={!tooltipContent}
        styles={{ tooltip: { maxWidth: 300 } }}
      >
        <Box
          className={`${classes.base} ${cx(classes.appContent, 'dashboard-tile-app')}`}
          h="100%"
          sx={{
            flexFlow: app.appearance.positionAppName ?? 'column',
          }}
        >
          {app.appearance.appNameStatus === 'normal' && (
            <Text
              className={cx(classes.appName, 'dashboard-tile-app-title')}
              fw={700}
              size={app.appearance.appNameFontSize}
              ta="center"
              sx={{
                flex: isRow ? '1' : undefined,
              }}
              lineClamp={app.appearance.lineClampAppName}
            >
              {app.name}
            </Text>
          )}
          <motion.img
            className={cx(classes.appImage, 'dashboard-tile-app-image')}
            src={app.appearance.iconUrl}
            alt={app.name}
            whileHover={{ scale: 0.9 }}
            initial={{ scale: 0.8 }}
            style={{
              width: isRow ? 0 : undefined,
            }}
          />
        </Box>
      </Tooltip.Floating>
    );
  }

  return (
    <HomarrCardWrapper className={className} p={10}>
      <AppMenu app={app} />
      {!app.url || isEditMode ? (
        <UnstyledButton
          className={`${classes.button} ${classes.base}`}
          style={{ pointerEvents: isEditMode ? 'none' : 'auto' }}
        >
          <Inner />
        </UnstyledButton>
      ) : (
        <UnstyledButton
          style={{ pointerEvents: isEditMode ? 'none' : 'auto' }}
          component="a"
          rel="noreferrer"
          href={href}
          target={app.behaviour.isOpeningNewTab ? '_blank' : '_self'}
          className={`${classes.button} ${classes.base}`}
        >
          <Inner />
        </UnstyledButton>
      )}
      <AppPing app={app} />
      {/* Start/Stop/Restart Buttons with UnstyledButton */}
      <Box mt="xs" sx={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
        <UnstyledButton onClick={startService} className={classes.button}>
          <Text size="xs">Start</Text>
        </UnstyledButton>
        <UnstyledButton onClick={stopService} className={classes.button}>
          <Text size="xs">Stop</Text>
        </UnstyledButton>
        <UnstyledButton onClick={restartService} className={classes.button}>
          <Text size="xs">Restart</Text>
        </UnstyledButton>
      </Box>
    </HomarrCardWrapper>
  );
};

const useStyles = createStyles((theme, _params, getRef) => ({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appContent: {
    gap: 0,
    overflow: 'visible',
    flexGrow: 5,
  },
  appImage: {
    maxHeight: '100%',
    maxWidth: '100%',
    overflow: 'auto',
    flex: 1,
    objectFit: 'contain',
  },
  appName: {
    wordBreak: 'break-word',
  },
  button: {
    height: '100%',
    width: '100%',
    gap: 4,
  },
}));

export const appTileDefinition = {
  component: AppTile,
  minWidth: 1,
  minHeight: 1,
  maxWidth: 12,
  maxHeight: 12,
};
