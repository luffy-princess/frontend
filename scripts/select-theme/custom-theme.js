import { StyleSheet } from 'react-native';
import responsive from '../responsive';

import Colors from './colors';

export const ICONS = {
  ARROW_DOWN: require('./icons/arrow-down.png'),
  ARROW_UP: require('./icons/arrow-up.png'),
  TICK: require('./icons/tick.png'),
  CLOSE: require('./icons/close.png'),
};

export default StyleSheet.create({
  arrowIcon: {
    height: responsive(20),
    width: responsive(20),
  },
  arrowIconContainer: {
    marginLeft: responsive(10),
  },
  badgeDotStyle: {
    backgroundColor: Colors.GREY,
    borderRadius: 10 / 2,
    height: responsive(10),
    marginRight: responsive(8),
    width: responsive(10),
  },
  badgeSeparator: {
    width: responsive(5),
  },
  badgeStyle: {
    alignItems: 'center',
    backgroundColor: Colors.ALTO,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: responsive(10),
    paddingVertical: responsive(5),
  },
  closeIcon: {
    height: responsive(30),
    width: responsive(30),
  },
  closeIconContainer: {
    marginLeft: responsive(10),
  },
  container: {
    width: '100%',
  },
  customItemContainer: {},
  customItemLabel: {
    fontStyle: 'italic',
  },
  dropDownContainer: {
    backgroundColor: '#E8E7EA',
    borderColor: Colors.BLACK,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    maxHeight: responsive(150),
    zIndex: 1000,
  },
  extendableBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  extendableBadgeItemContainer: {
    marginEnd: responsive(7),
    marginVertical: responsive(3),
  },
  flatListContentContainer: {
    flexGrow: 1,
  },
  iconContainer: {
    marginRight: responsive(10),
  },
  itemSeparator: {
    backgroundColor: Colors.BLACK,
    height: responsive(1),
  },
  label: {
    color: Colors.BLACK,
    flex: 1,
    fontFamily: 'pretend-light',
    fontSize: responsive(14),
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listBody: {
    height: '100%',
  },
  listBodyContainer: {
    alignItems: 'center',
    flexGrow: 1,
  },
  listChildContainer: {
    paddingLeft: responsive(40),
  },
  listChildLabel: {},
  listItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: responsive(40),
    justifyContent: 'space-between',
    paddingHorizontal: responsive(10),
  },
  listItemLabel: {
    color: Colors.BLACK,
    fontSize: responsive(14),
    flex: 1,
  },
  listMessageContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: responsive(10),
  },
  listMessageText: {},
  listParentContainer: {},
  listParentLabel: {},
  modalContentContainer: {
    flexGrow: 1,
  },
  modalTitle: {
    color: Colors.BLACK,
    fontSize: responsive(18),
  },
  searchContainer: {
    alignItems: 'center',
    borderBottomColor: Colors.BLACK,
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: responsive(10),
  },
  searchTextInput: {
    borderColor: Colors.BLACK,
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.BLACK,
    flexGrow: 1,
    flexShrink: 1,
    margin: 0,
    paddingHorizontal: responsive(10),
    paddingVertical: responsive(5),
  },
  selectedItemContainer: {},
  selectedItemLabel: {},
  style: {
    alignItems: 'center',
    backgroundColor: '#E8E7EA',
    borderColor: Colors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: responsive(50),
    padding: responsive(17),
    width: '100%',
  },
  tickIcon: {
    height: responsive(20),
    width: responsive(20),
  },
  tickIconContainer: {
    marginLeft: responsive(10),
  },
});