import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PREFERENCE_KEYS, getLocale, getTheme, applySitePreferences,
  setSiteLocale, setSiteTheme, subscribeToSitePreferences,
} from '../lib/site-preferences-store';

function setupBrowser(storageDisabled=false) {
  const values=new Map<string,string>();
  const media=new EventTarget();
  const browser=Object.assign(new EventTarget(), {
    localStorage: {
      getItem:(key:string)=>storageDisabled?null:values.get(key)??null,
      setItem:(key:string,value:string)=>{if(storageDisabled)throw new Error('Storage disabled');values.set(key,value);},
      removeItem:(key:string)=>values.delete(key),
    },
    matchMedia:(_query:string)=>Object.assign(media,{matches:false}),
  });
  const root={lang:'',dataset:{} as Record<string,string>};
  Object.defineProperty(globalThis,'window',{configurable:true,value:browser});
  Object.defineProperty(globalThis,'document',{configurable:true,value:{documentElement:root}});
  return {values,browser,root};
}

function cleanupBrowser() {
  Reflect.deleteProperty(globalThis,'window');
  Reflect.deleteProperty(globalThis,'document');
}

test('a click updates HTML, localStorage, and all subscribers synchronously',()=>{
  const {values,root}=setupBrowser();
  let changeCount=0;
  const stop=subscribeToSitePreferences(()=>changeCount++);
  try {
    setSiteLocale('en');
    setSiteTheme('dark');
    assert.equal(getLocale(),'en');
    assert.equal(getTheme(),'dark');
    assert.equal(root.lang,'en');
    assert.equal(root.dataset.theme,'dark');
    assert.equal(values.get(PREFERENCE_KEYS.locale),'en');
    assert.equal(values.get(PREFERENCE_KEYS.theme),'dark');
    assert.equal(changeCount,2);
    stop();
    setSiteTheme('light');
    assert.equal(changeCount,2);
    assert.equal(root.dataset.theme,'light');
  } finally {stop();cleanupBrowser();}
});

test('language and theme remain switchable when browser storage is blocked',()=>{
  const {root}=setupBrowser(true);
  try {
    setSiteLocale('id');
    setSiteTheme('dark');
    applySitePreferences();
    assert.equal(getLocale(),'id');
    assert.equal(getTheme(),'dark');
    assert.equal(root.lang,'id');
    assert.equal(root.dataset.theme,'dark');
  } finally {cleanupBrowser();}
});

test('a storage change in another tab updates the current document',()=>{
  const {values,browser,root}=setupBrowser();
  const stop=subscribeToSitePreferences(()=>{});
  try {
    values.set(PREFERENCE_KEYS.locale,'en');
    values.set(PREFERENCE_KEYS.theme,'dark');
    browser.dispatchEvent(new Event('storage'));
    assert.equal(root.lang,'en');
    assert.equal(root.dataset.theme,'dark');
  } finally {stop();cleanupBrowser();}
});
