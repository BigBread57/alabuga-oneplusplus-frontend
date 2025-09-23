import { Grid } from 'antd'

const { useBreakpoint } = Grid

/**
 * Хук для определения типа устройства на основе размеров экрана.
 * Возвращает объект с булевыми значениями для мобильных, планшетов и десктопов.
 *
 * @returns {object} - { isMobile: boolean, isTablet: boolean, isDesktop: boolean }
 */
export const useScreens = () => {
  const screens = useBreakpoint()

  const isMobile = screens.xs && !screens.sm
  const isTablet = screens.sm && !screens.lg

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet }
}
