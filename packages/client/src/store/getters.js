import router from '../router';

export default {
  activePreset: state => {
    const { params, query } = router.currentRoute;
    console.log(params);
  }
}
